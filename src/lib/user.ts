import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

interface UserWithPasswordHash extends Omit<User, 'password'> {
  password: string;
}

const prisma = new PrismaClient();

// Fungsi untuk mengambil pengguna dari database berdasarkan email
async function getUserFromDb(email: string, password: string): Promise<UserWithPasswordHash | null> {
  try {
    // Cari pengguna berdasarkan email di database menggunakan Prisma
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Jika pengguna ditemukan, verifikasi password
    if (user && user.password) {
      // Verifikasi password dengan menggunakan bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Password cocok, kembalikan objek user
        return user as UserWithPasswordHash; // Cast user ke UserWithPasswordHash
      }
    }

    // Jika pengguna tidak ditemukan atau password tidak cocok, kembalikan null
    return null;
  } catch (error) {
    // Tangani error jika ada kesalahan dalam mengakses database
    console.error("Error retrieving user from database:", error);
    throw new Error("Database access error");
  }
}
