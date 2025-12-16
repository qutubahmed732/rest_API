import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import Category from "@/lib/modals/category";

export const GET = async (request: Request, { params }: { params: Promise<{ blog: string }> }) => {
  try {
    // extracting blog id from params
    const IDs = await params;
    const blogId = IDs.blog;

    // extracting user id from search params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    // checking user id validity

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing User ID" }), { status: 400 });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing Category ID" }), { status: 400 })
    }

    // checking blog id validity
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing Blog ID" }), { status: 400 })
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
    const category = await Category.findById(categoryId);

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }), { status: 404 }
      );
    }


    // checking if blog exists
    const blog = await Blog.findOne({
      _id: blogId,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId)
    }).populate('category').populate('user');

    // if blog not found
    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog not found" }), { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ blog }), { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error", error }), { status: 500 }
    );
  }
}

export const PATCH = async (request: Request, { params }: { params: Promise<{ blog: string }> }) => {

  try {

    // extracting blog id from params
    const IDs = await params;
    const blogId = IDs.blog;

    const { title, description } = await request.json();

    // extracting user id from search params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // checking user id validity
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing User ID" }), { status: 400 });
    }

    // checking blog id validity
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing Blog ID" }), { status: 400 })
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

    // checking if blog exists
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description }
    );

    // if blog not found
    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog not found" }), { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ blog }), { status: 200 }
    );


  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error in fetching a blog", error }), { status: 500 }
    );
  }

}


export const DELETE = async (request: Request, { params }: { params: Promise<{ blog: string }> }) => {
  try {

    // extracting blog id from params
    const IDs = await params;
    const blogId = IDs.blog;

    // extracting user id from search params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // checking user id validity
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing User ID" }), { status: 400 });
    }

    // checking blog id validity
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing Blog ID" }), { status: 400 })
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

    // deleting the blog
    const blog = await Blog.findOneAndDelete({
      _id: blogId,
      user: new Types.ObjectId(userId)
    });

    // if blog not found
    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog not found" }), { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Blog deleted successfully" }), { status: 200 }
    );

  } catch (error: any) {
    return new NextResponse("Error deleting blog: " + error.message, { status: 500 });
  }

}