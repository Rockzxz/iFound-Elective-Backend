const { ObjectId } = require("mongodb");

exports.createPost = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const postData = req.body; 

    // --- FIX: CONVERT COORDINATES TO NUMBERS ---
    if (postData.latitude) postData.latitude = parseFloat(postData.latitude);
    if (postData.longitude) postData.longitude = parseFloat(postData.longitude);
    // -------------------------------------------

    if (req.file) {
      postData.imageUrl = req.file.path.replace(/\\/g, "/"); 
    } else {
      postData.imageUrl = "";
    }

    await db.collection("posts").insertOne(postData);
    
    console.log("✅ Post created at:", postData.latitude, postData.longitude);
    res.json({ message: "Post created", post: postData });

  } catch (e) {
    console.error("Error creating post:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getPosts = async (req, res) => {
  const db = req.app.locals.db;
  try {
    //  ADD THE FILTER { status: 'active' }
    const posts = await db.collection("posts")
        .find({ status: "active" }) 
        .sort({ _id: -1 }) 
        .toArray();

    res.json(posts);
  } catch (e) {
    console.error("Error getting posts:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updatePost = async (req, res) => {
  const db = req.app.locals.db;
  await db.collection("posts").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.json({ message: "Post updated" });
};

exports.deletePost = async (req, res) => {
  const db = req.app.locals.db;
  await db.collection("posts").deleteOne({
    _id: new ObjectId(req.params.id)
  });
  res.json({ message: "Post deleted" });
};