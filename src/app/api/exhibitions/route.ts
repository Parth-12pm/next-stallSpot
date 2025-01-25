import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Event from '@/models/Event'
import { FilterQuery } from 'mongoose'
import { IEvent } from '@/models/Event'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Get search params
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const venues = searchParams.getAll('venue')
    const facilities = searchParams.getAll('facilities')
    const stallTypes = searchParams.getAll('stallTypes')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const query: FilterQuery<IEvent> = { status: 'published' }

    if (search) {
      query.title = { $regex: search, $options: 'i' }
    }

    if (category) {
      query.category = category
    }

    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) }
      query.endDate = { $lte: new Date(endDate) }
    }

    if (venues.length > 0) {
      query.venue = { $in: venues }
    }

    if (facilities.length > 0) {
      query.facilities = { $all: facilities }
    }

    if (stallTypes.length > 0) {
      query['stallConfiguration.type'] = { $in: stallTypes }
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    const [events, total] = await Promise.all([
      Event.find(query)
        .sort({ startDate: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Event.countDocuments(query)
    ])

    return NextResponse.json({
      events,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching exhibitions:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

