import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';

export interface UserProfile {
  id?: number;
  username: string;
  nombre: string;
  apellido: string;
  nivelEducacion: string;
  fechaNacimiento: string;
}
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private database: SQLiteObject | null = null;
  private databaseReady = new BehaviorSubject<boolean>(false);
  private isAuthenticated: boolean = false;
  private usernameSubject = new BehaviorSubject<string>('');
  public username$ = this.usernameSubject.asObservable();
  authStatusChange: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private initializationPromise: Promise<void> | null = null;

  constructor(
    private sqlite: SQLite,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      console.log('Plataforma lista - Iniciando base de datos');
      this.initializeDatabase();
    }).catch(error => {
      console.error('Error al esperar plataforma:', error);
    });
  }

  private async initializeDatabase() {
    console.log('Iniciando proceso de creación de base de datos');
    
    try {
      // Verificar si ya existe una instancia
      if (this.database) {
        console.log('Base de datos ya existe');
        this.databaseReady.next(true);
        return;
      }

      // Crear nueva instancia
      console.log('Creando nueva instancia de base de datos');
      this.database = await this.sqlite.create({
        name: 'usuarios.db',
        location: 'default'
      });
      
      console.log('Base de datos creada, creando tablas...');
      await this.createTables();
      
      console.log('Tablas creadas, verificando usuario admin...');
      await this.createAdminUser();
      
      console.log('Inicialización completa');
      this.databaseReady.next(true);
      
    } catch (error) {
      console.error('Error en initializeDatabase:', error);
      this.database = null;
      this.databaseReady.next(false);
    }
  }

 private async createTables() {
    try {
      if (!this.database) {
        throw new Error('No hay conexión a la base de datos');
      }

      // Crear tabla de usuarios
      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT
        )`, []);
      console.log('Tabla users creada');

      // Crear tabla de perfiles
      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          nombre TEXT,
          apellido TEXT,
          nivelEducacion TEXT,
          fechaNacimiento TEXT,
          FOREIGN KEY(username) REFERENCES users(username)
        )`, []);
      console.log('Tabla profiles creada');

    } catch (error) {
      console.error('Error creando tablas:', error);
      throw error;
    }
  }

  private async createAdminUser() {
    try {
      if (!this.database) {
        throw new Error('No hay conexión a la base de datos');
      }

      const result = await this.database.executeSql(
        'SELECT * FROM users WHERE username = ?',
        ['admin']
      );

      if (result.rows.length === 0) {
        const adminPassword = this.encryptPassword('1234');
        await this.database.executeSql(
          'INSERT INTO users (username, password) VALUES (?, ?)',
          ['admin', adminPassword]
        );

        await this.database.executeSql(
          'INSERT INTO profiles (username, nombre, apellido, nivelEducacion, fechaNacimiento) VALUES (?, ?, ?, ?, ?)',
          ['admin', 'Administrador', 'Sistema', 'Superior', '2000-01-01']
        );
        console.log('Usuario admin creado');
      } else {
        console.log('Usuario admin ya existe');
      }
    } catch (error) {
      console.error('Error creando usuario admin:', error);
      throw error;
    }
  }

  private async createDatabase() {
    try {
      this.database = await this.sqlite.create({
        name: 'usuarios.db',
        location: 'default'
      });
  
      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT
        )`, []);
  
      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          nombre TEXT,
          apellido TEXT,
          nivelEducacion TEXT,
          fechaNacimiento TEXT,
          FOREIGN KEY(username) REFERENCES users(username)
        )`, []);
  
      // Verificar si existe el usuario admin
      const result = await this.database.executeSql(
        'SELECT * FROM users WHERE username = ?',
        ['admin']
      );
  
      // Si no existe el usuario admin, lo creamos
      if (result.rows.length === 0) {
        const adminPassword = this.encryptPassword('1234'); // La contraseña será 'admin'
        await this.database.executeSql(
          'INSERT INTO users (username, password) VALUES (?, ?)',
          ['admin', adminPassword]
        );
  
        // Crear perfil para admin
        await this.database.executeSql(
          'INSERT INTO profiles (username, nombre, apellido, nivelEducacion, fechaNacimiento) VALUES (?, ?, ?, ?, ?)',
          ['admin', 'Administrador', 'Sistema', 'Superior', '2000-01-01']
        );
      }
  
      this.databaseReady.next(true);
    } catch (error) {
      console.error('Error al crear la base de datos:', error);
      this.databaseReady.next(false);
    }
  }

  private async getDatabaseInstance(): Promise<SQLiteObject> {
    // Si la base de datos no está inicializada, intentamos inicializarla
    if (!this.database) {
      console.log('Intentando inicializar la base de datos...');
      await this.initializeDatabase();
    }

    if (!this.database) {
      throw new Error('No se pudo inicializar la base de datos');
    }

    return this.database;
  }

  async createProfile(profile: UserProfile): Promise<boolean> {
    try {
      const db = await this.getDatabaseInstance();
      await db.executeSql(
        'INSERT INTO profiles (username, nombre, apellido, nivelEducacion, fechaNacimiento) VALUES (?, ?, ?, ?, ?)',
        [profile.username, profile.nombre, profile.apellido, profile.nivelEducacion, profile.fechaNacimiento]
      );
      return true;
    } catch (error) {
      console.error('Error al crear perfil:', error);
      return false;
    }
  }

  async updateProfile(profile: UserProfile): Promise<boolean> {
    try {
      const db = await this.getDatabaseInstance();
      await db.executeSql(
        'UPDATE profiles SET nombre = ?, apellido = ?, nivelEducacion = ?, fechaNacimiento = ? WHERE username = ?',
        [profile.nombre, profile.apellido, profile.nivelEducacion, profile.fechaNacimiento, profile.username]
      );
      return true;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return false;
    }
  }

  async getProfile(username: string): Promise<UserProfile | null> {
    try {
      const db = await this.getDatabaseInstance();
      const result = await db.executeSql(
        'SELECT * FROM profiles WHERE username = ?',
        [username]
      );
      
      if (result.rows.length > 0) {
        return result.rows.item(0);
      }
      return null;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return null;
    }
  }

  async deleteProfile(username: string): Promise<boolean> {
    try {
      const db = await this.getDatabaseInstance();
      await db.executeSql(
        'DELETE FROM profiles WHERE username = ?',
        [username]
      );
      return true;
    } catch (error) {
      console.error('Error al eliminar perfil:', error);
      return false;
    }
  }

  async register(username: string, password: string): Promise<{ success: boolean, message: string }> {
    try {
      const db = await this.getDatabaseInstance();
      
      // Verificar si el usuario ya existe
      const checkUser = await db.executeSql(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (checkUser.rows.length > 0) {
        return { 
          success: false, 
          message: 'El nombre de usuario ya está registrado' 
        };
      }

      // Encriptar la contraseña
      const encryptedPassword = this.encryptPassword(password);

      // Insertar nuevo usuario
      await db.executeSql(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, encryptedPassword]
      );

      return { 
        success: true, 
        message: 'Usuario registrado exitosamente' 
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        message: 'Error al registrar usuario' 
      };
    }
  }

  async login(username: string, password: string): Promise<{ success: boolean, message: string }> {
    try {
      const isReady = await this.isDatabaseReady();
      if (!isReady) {
        return {
          success: false,
          message: 'La base de datos está inicializando. Por favor espere unos segundos e intente nuevamente.'
        };
      }

      if (!this.database) {
        return {
          success: false,
          message: 'Error de conexión con la base de datos'
        };
      }

      if (!username || !password) {
        return {
          success: false,
          message: 'Por favor ingrese usuario y contraseña'
        };
      }

      const encryptedPassword = this.encryptPassword(password);
      const result = await this.database.executeSql(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, encryptedPassword]
      );

      if (result.rows.length > 0) {
        this.isAuthenticated = true;
        this.usernameSubject.next(username);
        this.authStatusChange.next(true);
        localStorage.setItem('currentUser', username);
        return {
          success: true,
          message: 'Login exitoso'
        };
      }

      return {
        success: false,
        message: 'Usuario o contraseña incorrectos'
      };

    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error al intentar iniciar sesión'
      };
    }
  }

  private encryptPassword(password: string): string {
    return CryptoJS.SHA256(password).toString();
  }

  async checkExistingSession(): Promise<boolean> {
    const savedUsername = localStorage.getItem('currentUser');
    if (savedUsername) {
      this.isAuthenticated = true;
      this.usernameSubject.next(savedUsername);
      this.authStatusChange.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.usernameSubject.next('');
    this.authStatusChange.next(false);
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getCurrentUsername(): string {
    return this.usernameSubject.value;
  }

  async isDatabaseReady(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.databaseReady.value && this.database) {
        return resolve(true);
      }

      const timeout = setTimeout(() => {
        subscription.unsubscribe();
        resolve(false);
      }, 10000);

      const subscription = this.databaseReady.subscribe(ready => {
        if (ready && this.database) {
          clearTimeout(timeout);
          subscription.unsubscribe();
          resolve(true);
        }
      });
    });
  }

}