var express     = require("express"),
methodOverride  = require("method-override")
app             = express(),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose"),
sanitizer       = require("express-sanitizer");


// mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology',true);
// mongoose.connect("mongodb://localhost/My_blog_app");

mongoose.connect("mongodb+srv://review:yohoneysingh@1@cluster0-jhje6.mongodb.net/test?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology:true

});


// -------------------------------------------------------------------------------------------     
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.use(sanitizer())

// --------------Not to write ejs again agian-----------------------------------------------
                        app.set("view engine","ejs");
// --------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------------

var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date , default:Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"Test Blog",   
//     image:"https://media-cdn.tripadvisor.com/media/photo-s/0c/a5/e7/fd/night-view.jpg",
//     body:"hello this is a blog Post!"
// });

app.get("/",(req,res)=>{
    res.redirect("/blogs");
});

app.get("/blogs",(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
    
});

app.get("/blogs/new",(req,res)=>{
    res.render("new");
});

app.post("/blogs",(req,res)=>{
    Blog.create(req.body.blog,(err,newBlog)=>{
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            // console.log(err);
            res.redirect("/blogs");
        }

        else{
            res.render("show",{blog:foundBlog});
        }
    });
});

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.render("edit",{blog:foundBlog})
        }
    })
  
})

app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){ 
            res.redirect("/blogs")
        }
        else{
            res.redirect("/blogs/" + req.params.id)
        }
    });
});

app.delete("/blogs/:id",function(req,res){
    // destroy blog
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/blogs")
        }
    })

})

// app.listen(3000,()=>{
//     console.log("server is started on port http://localhost:3000");
// });

app.listen(process.env.PORT || 3000)