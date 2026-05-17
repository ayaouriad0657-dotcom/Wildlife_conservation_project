# Wildlife Conservation Monitoring System

## Overview
Wildlife Conservation Monitoring System is a database-driven web application designed to support the tracking and management of wildlife, habitats, species, and conservation activities. The system is built with a role-based access control mechanism that allows secure login for administrators and rangers. Rangers can record wildlife sightings, report threats, and track conservation actions, while administrators manage system data and user roles. The project uses Supabase (PostgreSQL) as the cloud database and a frontend built with HTML, CSS, and JavaScript.

## Features
User authentication (login system)  
Role-based access control (Admin, Ranger)  
Wildlife species and animal tracking  
Habitat management  
Wildlife sightings recording  
Threat detection and tracking  
Conservation activity management  
Full CRUD operations through UI  
Data display from database tables  
6 functional UI screens (excluding login)  

## Tech Stack
Frontend: HTML, CSS, JavaScript  
Backend Database: Supabase (PostgreSQL)  
Database: Relational schema with foreign keys  
Hosting: Supabase cloud database  
Version Control: GitHub  

## Database Schema

### Core Tables

**roles**  
Stores user roles such as admin and ranger  

**users**  
Stores system users and links each user to a role for authentication and authorization  

**rangers**  
Stores ranger-specific information and links to users table  

**species**  
Stores wildlife species information including conservation status and population  

**habitats**  
Stores habitat details such as location, country, and ecosystem type  

**animals**  
Stores individual animals and links to species and habitats  

**wildlife_sightings**  
Records animal observations made by rangers including timestamp, count, and threat detection  

**animals_threats**  
Stores threats detected during sightings and links animals with sightings  

**conservation_activities**  
Tracks actions taken by rangers against threats and links to threats and rangers  

## Database Relationships
Users → Roles (many-to-one)  
Rangers → Users (one-to-one)  
Animals → Species (many-to-one)  
Animals → Habitats (many-to-one)  
Wildlife Sightings → Animals, Rangers, Habitats  
Threats → Animals, Sightings  
Conservation Activities → Threats, Rangers  

## Functional Modules (UI Screens)
Dashboard (overview of system data)  
Animals management (CRUD operations)  
Species management (CRUD operations)  
Habitats management (CRUD operations)  
Sightings & threats management  
Conservation activities tracking  

(Login page is separate and used for authentication only.)

## Authentication System
Secure login system using Supabase authentication logic  
Role-based access:  
Admin: full control over all tables and data  
Ranger: can add sightings, threats, and conservation activities  

## SQL Features
INSERT, UPDATE, DELETE operations for all tables  
JOIN queries across related tables  
Aggregation queries (COUNT, AVG, SUM)  
Filtering using WHERE clauses  
Relational queries across sightings, animals, and threats  

## Constraints & Data Integrity
Primary keys on all tables  
Foreign key relationships across all entities  
CHECK constraint for ranger experience years  
Unique constraints on emails and roles  
Default timestamp for sightings  

## Project Workflow
Database design (ER diagram + schema)  
Implementation in Supabase  
Frontend development (HTML, CSS, JS)  
UI connected to database (CRUD operations)  
Role-based authentication system  
Deployment using Supabase cloud  

## GitHub Repository
All project files are included:  
Database schema (SQL scripts)  
ER diagrams  
Frontend code  
UI screens  
SQL queries and functions  
