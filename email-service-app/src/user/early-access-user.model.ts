import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class EarlyAccessUser extends Model {
  @Column({
    allowNull: false,
    unique: true,
  })
  email: string;
}