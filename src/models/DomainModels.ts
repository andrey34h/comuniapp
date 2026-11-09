import { ServiceCategory, ServiceOffer, UserAccount, UserRole } from '../types';

/**
 * Clase Base Abstracta que aplica Encapsulamiento y Abstracción (POO)
 */
export abstract class EntidadComunitaria {
  protected readonly id: string;
  protected readonly createdAt: string;

  constructor(id: string, createdAt?: string) {
    this.id = id;
    this.createdAt = createdAt || new Date().toISOString().split('T')[0];
  }

  public getId(): string {
    return this.id;
  }

  public abstract obtenerResumen(): string;
}

/**
 * Clase UsuarioComunitario (Herencia de EntidadComunitaria)
 */
export class UsuarioComunitario extends EntidadComunitaria {
  private name: string;
  private email: string;
  private passwordHash: string;
  protected role: UserRole;
  private neighborhood: string;

  constructor(account: UserAccount) {
    super(account.id);
    this.name = account.name.trim();
    this.email = account.email.trim().toLowerCase();
    this.passwordHash = account.password;
    this.role = account.role;
    this.neighborhood = account.neighborhood.trim();
  }

  public validarCredenciales(email: string, passwordInput: string): boolean {
    return this.email === email.trim().toLowerCase() && this.passwordHash === passwordInput;
  }

  public puedePublicarServicios(): boolean {
    return this.role === 'Emprendedor';
  }

  public toDTO(): UserAccount {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.passwordHash,
      role: this.role,
      neighborhood: this.neighborhood,
    };
  }

  public override obtenerResumen(): string {
    return `${this.name} (${this.role} - ${this.neighborhood})`;
  }
}

/**
 * Clase ModeloServicio (Encapsula reglas de negocio de una oferta en ComuniApp)
 */
export class ModeloServicio extends EntidadComunitaria {
  private props: ServiceOffer;

  constructor(props: ServiceOffer) {
    super(props.id, props.createdAt);
    this.props = props;
  }

  public coincideConBusqueda(query: string, categoria: ServiceCategory): boolean {
    const q = query.trim().toLowerCase();
    const coincideCat = categoria === 'Todas' || this.props.category === categoria;
    const coincideTexto =
      !q ||
      this.props.title.toLowerCase().includes(q) ||
      this.props.description.toLowerCase().includes(q) ||
      this.props.providerName.toLowerCase().includes(q) ||
      this.props.neighborhood.toLowerCase().includes(q);

    return coincideCat && coincideTexto;
  }

  public toDTO(): ServiceOffer {
    return { ...this.props };
  }

  public override obtenerResumen(): string {
    return `${this.props.title} - $${this.props.priceCOP.toLocaleString('es-CO')} COP`;
  }
}
