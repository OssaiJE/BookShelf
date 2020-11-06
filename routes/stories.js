const express = require("express");
const router = express.Router();
const {ensureAuth} = require("../middleware/auth")
const Story = require("../models/Story");


// @desc Show add page
// @route Get /stories/add
router.get("/add", ensureAuth, (req, res) => {
    res.render("stories/add");
});

// @desc Process add form
// @route POST request to /stories
router.post("/", ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        res.render("/error/500");
    }
});

// @desc Show all stories
// @route Get /stories
router.get("/", ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({status: "public"})
        .populate("user")
        .sort({createdAt: "desc"})
        .lean();
        res.render("stories/index", {
            stories
        });
    } catch (err) {
        console.error(err);
        res.render("/error/500");
    }
});

// @desc View Single Story
// @route get request to /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id)
        .populate("user")
        .lean()

        if (!story) {
            return res.render("error/404");
        } else {
            res.render("stories/single", {
                story
            });
        }
    } catch (err) {
        console.error(err);
        res.render("/error/404");
    }
});

// @desc Show edit page
// @route Get /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean();
    
        if (!story) {
            return res.render("error/404");
        }
    
        if (story.user != req.user.id) {
            res.redirect("/stories");
        } else {
            res.render("stories/edit", {
                story
            });
        }
    } catch (err) {
        console.error(err);
        return res.render("error/500")
    }
});

// @desc Update story
// @route POST /stories/:id
router.post("/:id", ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean();
        if (!story) {
            return res.render("error/404");
        }
        if (story.user != req.user.id) {
            res.redirect("/stories");
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
        });
            res.redirect("/dashboard");
        }
    } catch (err) {
        console.error(err);
        return res.render("error/500");
    }
});

// @desc Delete stories
// @route DELETE /stories/delete/:id
router.get("/delete/:id", ensureAuth, async (req, res) => {
    try {
        await Story.findByIdAndRemove({_id: req.params.id});
        res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        return res.render("/error/500");
    }
});

// @desc Show User Stories
// @route Get /stories/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: "public"
        })
        .populate("user")
        .lean();
        res.render("stories/index", {
            stories
        });
    } catch (err) {
        console.error(err);
        res.render("error/500");
    }
});


module.exports = router;