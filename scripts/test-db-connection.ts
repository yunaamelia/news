#!/usr/bin/env tsx
/**
 * Database Connection Test Script
 * 
 * Tests:
 * - Database connectivity
 * - Prisma Client initialization
 * - Connection pool metrics
 * - Basic query execution
 */

import dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import { prisma } from '../app/lib/prisma'

async function testConnection() {
  console.log('🔄 Testing database connection...\n')

  try {
    // Test 1: Raw query
    console.log('Test 1: Raw SQL query')
    const result = await prisma.$queryRaw`SELECT 1 as connected, NOW() as timestamp`
    console.log('✅ Database connected:', result)
    console.log('')

    // Test 2: Model query
    console.log('Test 2: Count users')
    const userCount = await prisma.user.count()
    console.log(`✅ Users in database: ${userCount}`)
    console.log('')

    // Test 3: Count articles
    console.log('Test 3: Count articles')
    const articleCount = await prisma.article.count()
    console.log(`✅ Articles in database: ${articleCount}`)
    console.log('')

    // Test 4: Connection pool metrics (skip - requires metrics preview feature)
    console.log('Test 4: Connection pool metrics')
    console.log('ℹ️  Metrics preview feature not enabled (optional)')
    console.log('')

    // Test 5: Database info
    console.log('Test 5: Database information')
    const dbInfo = await prisma.$queryRaw<Array<{ database: string; user: string; version: string }>>`
      SELECT 
        current_database() as database,
        current_user as user,
        version() as version
    `
    
    if (dbInfo && dbInfo[0]) {
      console.log('✅ Database info:', {
        database: dbInfo[0].database,
        user: dbInfo[0].user,
        version: dbInfo[0].version.split(',')[0], // Only first part
      })
    }
    console.log('')

    // Summary
    console.log('═'.repeat(60))
    console.log('✅ All database tests passed!')
    console.log('═'.repeat(60))
    console.log(`
Environment:
  - NODE_ENV: ${process.env.NODE_ENV || 'development'}
  - Using pooled connection: ${process.env.POSTGRES_PRISMA_URL ? '✅' : '❌'}
  - Using direct connection: ${process.env.POSTGRES_URL_NON_POOLING ? '✅' : '❌'}
  - Fallback DATABASE_URL: ${process.env.DATABASE_URL ? '✅' : '❌'}
`)

  } catch (error) {
    console.error('❌ Database connection test failed!')
    console.error('')
    
    if (error instanceof Error) {
      console.error('Error:', error.message)
      
      // Provide helpful error messages
      if (error.message.includes('Can\'t reach database server')) {
        console.error('')
        console.error('💡 Possible solutions:')
        console.error('  1. Check if POSTGRES_PRISMA_URL is set in .env.local')
        console.error('  2. Increase connection timeout: add connect_timeout=30 to URL')
        console.error('  3. Verify database is running and accessible')
      } else if (error.message.includes('password authentication failed')) {
        console.error('')
        console.error('💡 Possible solutions:')
        console.error('  1. Check if database credentials are correct')
        console.error('  2. Update POSTGRES_PRISMA_URL with correct password')
      } else if (error.message.includes('Database connection string not found')) {
        console.error('')
        console.error('💡 Required environment variables:')
        console.error('  - POSTGRES_PRISMA_URL (pooled connection)')
        console.error('  or')
        console.error('  - DATABASE_URL (fallback)')
      }
    } else {
      console.error('Unknown error:', error)
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('\n👋 Disconnected from database')
  }
}

// Run test
testConnection()
