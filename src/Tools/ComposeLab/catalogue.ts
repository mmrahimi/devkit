import type { ServicePreset } from './types';

export const serviceCatalogue: ServicePreset[] = [
  { name: 'PostgreSQL', image: 'postgres:17', ports: ['127.0.0.1:5432:5432'], environment: [{ key: 'POSTGRES_PASSWORD', value: '' }] },
  { name: 'MySQL', image: 'mysql:8.4', ports: ['127.0.0.1:3306:3306'], environment: [{ key: 'MYSQL_ROOT_PASSWORD', value: '' }] },
  { name: 'Redis', image: 'redis:7', ports: ['127.0.0.1:6379:6379'] },
  { name: 'MongoDB', image: 'mongo:8', ports: ['127.0.0.1:27017:27017'], environment: [{ key: 'MONGO_INITDB_ROOT_USERNAME', value: '' }, { key: 'MONGO_INITDB_ROOT_PASSWORD', value: '' }] },
  { name: 'Nginx', image: 'nginx:alpine', ports: ['127.0.0.1:8080:80'] },
  { name: 'MariaDB', image: 'mariadb:11', ports: ['127.0.0.1:3306:3306'], environment: [{ key: 'MARIADB_ROOT_PASSWORD', value: '' }] },
  { name: 'Adminer', image: 'adminer:latest', ports: ['127.0.0.1:8081:8080'] },
  { name: 'RabbitMQ', image: 'rabbitmq:4-management', ports: ['127.0.0.1:5672:5672', '127.0.0.1:15672:15672'] },
];
