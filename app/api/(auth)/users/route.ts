import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { Types } from "mongoose";

export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error fetching users" + error.message, { status: 500 });
    }
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();
        return new NextResponse(JSON.stringify({ user: newUser, message: "User created successfully" }), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error in creating user: " + error.message, { status: 500 });
    }
}

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId, newUsername } = body;

        await connect();
        if (!userId || !newUsername) {
            return new NextResponse(JSON.stringify({ message: "User ID is required for update", status: 400 }));
        }
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse("Invalid User ID", { status: 400 });
        }
        const updatedUser = await User.findByIdAndUpdate(
            { _id: Object(userId) },
            { username: newUsername },
            { new: true }
        );

        if (!updatedUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        return new NextResponse(JSON.stringify({ user: updatedUser, message: "User updated successfully" }), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error in updating user: " + error.message, { status: 500 });
    }
};

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return new NextResponse(JSON.stringify({ message: "User ID is required for deletion", status: 400 }));
        } else if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse("Invalid User ID", { status: 400 });
        }
        await connect();
        const deletedUser = await User.findByIdAndDelete({ _id: Object(userId) });
        if (!deletedUser) {
            return new NextResponse("User not found", { status: 404 });
        }
        return new NextResponse(JSON.stringify({ user: deletedUser, message: "User deleted successfully" }), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error in deleting user: " + error.message, { status: 500 });
    }
}