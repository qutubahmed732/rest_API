import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import Category from "@/lib/modals/category";

export const GET = async (request: Request) => {
  try {

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchKeywords = searchParams.get("keywords");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing User ID" }), { status: 400 });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing Category ID" }), { status: 400 })
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }), { status: 404 }
      );
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }), { status: 404 }
      );
    }

    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    }

    if (searchKeywords) filter.$or = [
      { title: { $regex: searchKeywords, $options: "i" } },
      { description: { $regex: searchKeywords, $options: "i" } }
    ];

    if (startDate && endDate) filter.createdAt = {$gte: new Date(startDate),$lte: new Date(endDate)};
    else if (startDate) filter.createdAt = { $gte: new Date(startDate) };
    else if (endDate) filter.createdAt = { $lte: new Date(endDate) };

    const blogs = await Blog.find(filter);

    return new NextResponse(
      JSON.stringify({ blogs }), { status: 200 }
    );

  } catch (error: any) {
    return new NextResponse("Error in fetching blogs" + error.message, { status: 500 });
  }
}

export const POST = async (request: Request) => {
  try {

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const { title, description } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing User ID" }), { status: 400 });
    };

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing Category ID" }), { status: 400 });
    };

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }), { status: 404 }
      );
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }), { status: 404 }
      );
    }

    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();

    return new NextResponse(
      JSON.stringify({ blog: newBlog, message: "Blog created successfully" }), { status: 201 }
    );

  } catch (error: any) {
    return new NextResponse("Error in creating blog: " + error.message, { status: 500 });
  }
};

