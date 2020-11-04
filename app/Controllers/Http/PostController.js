"use strict";

// Bring in model
const Post = use("App/Models/Post");
// Bring in validator
const { validate } = use("Validator");

class PostController {
  async index({ view }) {
    // const posts = [
    //   {
    //     title: "Post 1",
    //     body:
    //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus delectus nisi iusto quia suscipit, dolorum ut, ratione laudantium recusandae non libero fugiat quasi dolorem, quidem officiis. Est maxime sint recusandae!",
    //   },
    //   {
    //     title: "Post 2",
    //     body:
    //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus delectus nisi iusto quia suscipit, dolorum ut, ratione laudantium recusandae non libero fugiat quasi dolorem, quidem officiis. Est maxime sint recusandae!",
    //   },
    //   {
    //     title: "Post 3",
    //     body:
    //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus delectus nisi iusto quia suscipit, dolorum ut, ratione laudantium recusandae non libero fugiat quasi dolorem, quidem officiis. Est maxime sint recusandae!",
    //   },
    //   {
    //     title: "Post 4",
    //     body:
    //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus delectus nisi iusto quia suscipit, dolorum ut, ratione laudantium recusandae non libero fugiat quasi dolorem, quidem officiis. Est maxime sint recusandae!",
    //   },
    // ];

    const posts = await Post.all();

    return view.render("posts.index", {
      title: "Latest Posts",
      posts: posts.toJSON(),
    });
  }

  async details({ params, view }) {
    const post = await Post.find(params.id);

    return view.render("posts.details", {
      post,
    });
  }

  async add({ view }) {
    return view.render("posts.add");
  }

  //create
  async store({ request, response, session }) {
    // Validation
    const validation = await validate(request.all(), {
      title: "required|min:3|max:255",
      body: "required|min:3",
    });

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }

    const post = new Post();

    post.title = request.input("title");
    post.body = request.input("body");

    await post.save();

    session.flash({
      notification: "Post added!",
    });

    return response.redirect("/posts");
  }

  async edit({ params, view }) {
    const post = await Post.find(params.id);
    return view.render("posts.edit", {
      post: post,
    });
  }

  async update({ params, request, response, session }) {
    // Validation
    const validation = await validate(request.all(), {
      title: "required|min:3|max:255",
      body: "required|min:3",
    });

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }

    const post = await Post.find(params.id);
    post.title = request.input("title");
    post.body = request.input("body");

    await post.save();

    session.flash({
      notification: "Post Updated!",
    });

    return response.redirect("/posts");
  }
}

module.exports = PostController;
