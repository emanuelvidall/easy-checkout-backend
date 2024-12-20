# Payment Backend System

## Description

This is a NestJS backend system for managing orders, payments, and product data. It uses Prisma as the ORM and integrates with AWS S3 for file uploads and MercadoPago for payment processing.

---

## Descrição

Este é um sistema backend em NestJS para gerenciamento de pedidos, pagamentos e dados de produtos. Ele utiliza Prisma como ORM e integra com AWS S3 para upload de arquivos e MercadoPago para processamento de pagamentos.

---

## Features / Funcionalidades

- Manage Products, Orders, and Payments
- AWS S3 Integration for File Uploads
- MercadoPago Payment Gateway Integration
- Prisma ORM for database management
- GraphQL API with TypeScript
- Includes File Upload, Payment, and Product Management modules

---

## Gerenciamento de Produtos, Pedidos e Pagamentos

- Integração com AWS S3 para upload de arquivos
- Integração com o Gateway de Pagamento MercadoPago
- ORM Prisma para gerenciamento do banco de dados
- API GraphQL com TypeScript
- Inclui módulos para upload de arquivos, pagamentos e gerenciamento de produtos

---

## Installation / Instalação

```bash
$ npm install
```

---

## Running the Application / Executando a Aplicação

## Run prisma migrations

```
npx prisma generate; npx prisma migrate dev
```

### Development / Desenvolvimento

```bash
$ npm run start:dev
```

### Production / Produção

```bash
$ npm run start:prod
```

---

## Environment Variables / Variáveis de Ambiente

Create a `.env` file using `.env.example` for reference. / Crie um arquivo `.env` usando `.env.example` como referência.

---
