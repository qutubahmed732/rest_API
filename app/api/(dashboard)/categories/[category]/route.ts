import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";
import { Types } from "mongoose";

export const PATCH = async (request: Request, { params }: { params: Promise<{ category: string }> }) => {

    try {

        // extracting category id from params
        const IDs = await params;
        const categoryId = IDs.category;

        const { name } = await request.json();

        // extracting user id from search params
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        // checking user id validity
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing User ID" }), { status: 400 });
        }

        // checking category id validity
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing Category ID" }), { status: 400 })
        }

        // connecting to database
        await connect();

        // checking if user exists
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }), { status: 404 }
            );
        }

        // checking if category exists
        const category = await Category.findOne(
            { _id: categoryId, user: new Types.ObjectId(userId) }
        );

        // if category not found
        if (!category) {
            return new NextResponse(
                JSON.stringify({ message: "Category not found" }), { status: 404 }
            );
        }

        // updating category
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name },
            { new: true }
        );

        // returning response
        return new NextResponse(JSON.stringify({ category: updatedCategory, message: "Category updated successfully" }), { status: 200 });

    } catch (error: any) {
        return new NextResponse("Error fetching categories: " + error.message, { status: 500 });
    }
};


export const DELETE = async (request: Request, { params }: { params: Promise<{ category: string }> }) => {
    try {
        // extracting category id from params
        const IDs = await params;
        const categoryId = IDs.category;
        // extracting user id from search params
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        // checking user id validity
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing User ID" }), { status: 400 });
        }
        // checking category id validity
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing Category ID" }), { status: 400 })
        }
        // connecting to database
        await connect();
        // checking if user exists
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }), { status: 404 }
            );
        }
        // checking if category exists
        const category = await Category.findOne(
            { _id: categoryId, user: new Types.ObjectId(userId) }
        );
        // if category not found
        if (!category) {
            return new NextResponse(
                JSON.stringify({ message: "Category not found" }), { status: 404 }
            );
        }
        // deleting category
        await Category.findByIdAndDelete(categoryId);
        // returning response
        return new NextResponse(
            JSON.stringify({ message: "Category deleted successfully" }), { status: 200 }
        );
    } catch (error: any) {
        return new NextResponse("Error deleting category: " + error.message, { status: 500 });
    }
}