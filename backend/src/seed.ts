import bcrypt from 'bcryptjs'
import { env } from './config/env.js'
import { connectDatabase, disconnectDatabase } from './lib/database.js'
import {
  BranchModel,
  HotelModel,
  MenuCategoryModel,
  MenuItemModel,
  RoomModel,
  TableModel,
  UserModel,
} from './models/index.js'

await connectDatabase()

const passwordHash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD ?? 'change-this-password', 12)

const hotel = await HotelModel.findOneAndUpdate(
  { slug: 'aster-grand-addis' },
  {
    name: 'Aster Grand Addis',
    slug: 'aster-grand-addis',
    subdomain: 'aster',
    primaryColor: '#0f766e',
    secondaryColor: '#111815',
    defaultLanguage: 'en',
    subscriptionStatus: 'trial',
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

const branch = await BranchModel.findOneAndUpdate(
  { hotelId: hotel._id, name: 'Main Hotel' },
  {
    hotelId: hotel._id,
    name: 'Main Hotel',
    city: 'Addis Ababa',
    timezone: 'Africa/Addis_Ababa',
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

const superAdminEmail = process.env.SUPER_ADMIN_EMAIL ?? 'superadmin@platform.local'
const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD ?? 'change-this-password'
const superAdminHash = await bcrypt.hash(superAdminPassword, 12)

await UserModel.findOneAndUpdate(
  { email: superAdminEmail },
  {
    hotelId: hotel._id,
    email: superAdminEmail,
    fullName: 'Super Admin',
    role: 'SUPER_ADMIN',
    passwordHash: superAdminHash,
    isActive: true,
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

await UserModel.findOneAndUpdate(
  { email: env.NODE_ENV === 'production' ? process.env.SUPER_ADMIN_EMAIL : 'owner@aster.local' },
  {
    hotelId: hotel._id,
    email: 'owner@aster.local',
    fullName: 'Aster Hotel Owner',
    role: 'HOTEL_OWNER',
    passwordHash,
    isActive: true,
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

await UserModel.findOneAndUpdate(
  { email: 'kitchen@aster.local' },
  {
    hotelId: hotel._id,
    email: 'kitchen@aster.local',
    fullName: 'Kitchen Lead',
    role: 'KITCHEN_STAFF',
    passwordHash,
    isActive: true,
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

await TableModel.findOneAndUpdate(
  { qrToken: 'qr-table-12-aster' },
  {
    hotelId: hotel._id,
    branchId: branch._id,
    label: 'Table 12',
    qrToken: 'qr-table-12-aster',
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

await RoomModel.findOneAndUpdate(
  { qrToken: 'qr-room-406-aster' },
  {
    hotelId: hotel._id,
    branchId: branch._id,
    number: '406',
    floor: '4',
    qrToken: 'qr-room-406-aster',
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

const signature = await MenuCategoryModel.findOneAndUpdate(
  { hotelId: hotel._id, name: 'Signature' },
  { hotelId: hotel._id, name: 'Signature', sortOrder: 1, isActive: true },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

const lounge = await MenuCategoryModel.findOneAndUpdate(
  { hotelId: hotel._id, name: 'Lounge' },
  { hotelId: hotel._id, name: 'Lounge', sortOrder: 2, isActive: true },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

await MenuItemModel.findOneAndUpdate(
  { hotelId: hotel._id, name: 'Berbere Glazed Salmon' },
  {
    hotelId: hotel._id,
    categoryId: signature._id,
    name: 'Berbere Glazed Salmon',
    description: 'Pan-seared salmon with berbere glaze, greens, and citrus butter.',
    price: 32,
    tags: ['Chef pick', 'High protein'],
    isAvailable: true,
    prepMinutes: 18,
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

await MenuItemModel.findOneAndUpdate(
  { hotelId: hotel._id, name: 'Truffle Tibs Flatbread' },
  {
    hotelId: hotel._id,
    categoryId: lounge._id,
    name: 'Truffle Tibs Flatbread',
    description: 'Crisp flatbread with spiced tibs, truffle oil, herbs, and labneh.',
    price: 24,
    tags: ['Upsell', 'Shareable'],
    isAvailable: true,
    prepMinutes: 14,
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

const secondHotel = await HotelModel.findOneAndUpdate(
  { slug: 'marina-blue-resort' },
  {
    name: 'Marina Blue Resort',
    slug: 'marina-blue-resort',
    subdomain: 'marina',
    primaryColor: '#2563eb',
    secondaryColor: '#0f172a',
    defaultLanguage: 'en',
    subscriptionStatus: 'active',
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

await BranchModel.findOneAndUpdate(
  { hotelId: secondHotel._id, name: 'Marina Resort Main' },
  {
    hotelId: secondHotel._id,
    name: 'Marina Resort Main',
    city: 'Mombasa',
    timezone: 'Africa/Nairobi',
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

await UserModel.findOneAndUpdate(
  { email: 'owner@marina.local' },
  {
    hotelId: secondHotel._id,
    email: 'owner@marina.local',
    fullName: 'Marina Hotel Owner',
    role: 'HOTEL_OWNER',
    passwordHash,
    isActive: true,
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

await UserModel.findOneAndUpdate(
  { email: 'kitchen@marina.local' },
  {
    hotelId: secondHotel._id,
    email: 'kitchen@marina.local',
    fullName: 'Marina Kitchen Lead',
    role: 'KITCHEN_STAFF',
    passwordHash,
    isActive: true,
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

console.log('Seeded MongoDB hospitality demo data.')

await disconnectDatabase()
