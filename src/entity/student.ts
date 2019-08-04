import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Student {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    email!: string;


    @Column({ default: false })
    suspended!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}