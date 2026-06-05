import bcrypt from 'bcryptjs'
import { connectDatabase, disconnectDatabase } from './lib/database.js'
import {
  BranchModel,
  HotelModel,
  MenuCategoryModel,
  MenuItemModel,
  OrderModel,
  ReservationModel,
  RoomModel,
  ServiceRequestModel,
  TableModel,
  UserModel,
} from './models/index.js'

await connectDatabase()

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
const demoUserPassword = process.env.DEMO_USER_PASSWORD ?? 'DemoPass1!'
const demoUserHash = await bcrypt.hash(demoUserPassword, 12)

const superAdmin = await UserModel.findOneAndUpdate(
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

const demoUsers = [
  {
    email: 'owner@aster.local',
    fullName: 'Aster Owner',
    role: 'HOTEL_OWNER',
  },
  {
    email: 'manager@aster.local',
    fullName: 'Aster Manager',
    role: 'HOTEL_MANAGER',
  },
  {
    email: 'waiter@aster.local',
    fullName: 'Aster Waiter',
    role: 'WAITER',
  },
  {
    email: 'kitchen@aster.local',
    fullName: 'Aster Kitchen',
    role: 'KITCHEN_STAFF',
  },
  {
    email: 'reception@aster.local',
    fullName: 'Aster Reception',
    role: 'RECEPTIONIST',
  },
  {
    email: 'guest@aster.local',
    fullName: 'Aster Guest',
    role: 'GUEST',
  },
] as const

await Promise.all(
  demoUsers.map((user) =>
    UserModel.findOneAndUpdate(
      { email: user.email },
      {
        hotelId: hotel._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        passwordHash: demoUserHash,
        isActive: true,
        assignedBy: superAdmin._id,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ),
  ),
)

const table = await TableModel.findOneAndUpdate(
  { qrToken: 'qr-table-12-aster' },
  {
    hotelId: hotel._id,
    branchId: branch._id,
    label: 'Table 12',
    qrToken: 'qr-table-12-aster',
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
)

const room = await RoomModel.findOneAndUpdate(
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

const salmon = await MenuItemModel.findOneAndUpdate(
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

const flatbread = await MenuItemModel.findOneAndUpdate(
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

await Promise.all([
  ReservationModel.findOneAndUpdate(
    { hotelId: hotel._id, email: 'emma@example.com' },
    {
      hotelId: hotel._id,
      branchId: branch._id,
      guestName: 'Emma Johnson',
      email: 'emma@example.com',
      phone: '+251900000101',
      startsAt: new Date('2026-06-05T18:30:00.000Z'),
      partySize: 3,
      notes: 'Window table requested',
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ),
  ReservationModel.findOneAndUpdate(
    { hotelId: hotel._id, email: 'michael@example.com' },
    {
      hotelId: hotel._id,
      branchId: branch._id,
      guestName: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+251900000102',
      startsAt: new Date('2026-06-06T12:00:00.000Z'),
      partySize: 2,
      notes: 'Business lunch',
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ),
  OrderModel.findOneAndUpdate(
    { hotelId: hotel._id, notes: 'Seeded manager dashboard table order' },
    {
      hotelId: hotel._id,
      branchId: branch._id,
      tableId: table._id,
      status: 'COOKING',
      subtotal: 56,
      tax: 8.4,
      serviceFee: 2.8,
      total: 67.2,
      notes: 'Seeded manager dashboard table order',
      items: [
        {
          menuItemId: salmon._id,
          nameSnapshot: salmon.name,
          quantity: 1,
          unitPrice: salmon.price,
        },
        {
          menuItemId: flatbread._id,
          nameSnapshot: flatbread.name,
          quantity: 1,
          unitPrice: flatbread.price,
        },
      ],
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ),
  OrderModel.findOneAndUpdate(
    { hotelId: hotel._id, notes: 'Seeded manager dashboard room order' },
    {
      hotelId: hotel._id,
      branchId: branch._id,
      roomId: room._id,
      status: 'RECEIVED',
      subtotal: 24,
      tax: 3.6,
      serviceFee: 1.2,
      total: 28.8,
      notes: 'Seeded manager dashboard room order',
      items: [
        {
          menuItemId: flatbread._id,
          nameSnapshot: flatbread.name,
          quantity: 1,
          unitPrice: flatbread.price,
        },
      ],
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ),
  ServiceRequestModel.findOneAndUpdate(
    { hotelId: hotel._id, tableId: table._id, type: 'CALL_WAITER' },
    {
      hotelId: hotel._id,
      tableId: table._id,
      type: 'CALL_WAITER',
      isOpen: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ),
  ServiceRequestModel.findOneAndUpdate(
    { hotelId: hotel._id, roomId: room._id, type: 'CLEANING_REQUEST' },
    {
      hotelId: hotel._id,
      roomId: room._id,
      type: 'CLEANING_REQUEST',
      isOpen: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ),
])

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

console.log('Seeded MongoDB hospitality platform data.')

await disconnectDatabase()
