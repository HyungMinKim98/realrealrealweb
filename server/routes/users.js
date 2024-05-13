const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get('/auth', auth, (req, res) => {
    res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image,
      gender: req.user.gender || '',
      birthYear: req.user.birthYear || '',
      genre: req.user.genre || []
    });
  });

router.post("/register", (req, res) => {

    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

// 프로필 업데이트 엔드포인트
router.post('/update-profile', auth, (req, res) => {
    const { nickname, gender, birthYear, genre } = req.body;
  
    User.findOneAndUpdate(
      { _id: req.user._id },
      { name: nickname, gender, birthYear, genre },
      { new: true },
      (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true });
      }
    );
  });
  
  router.post('/upload-profile-photo', auth, (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    const profilePhoto = req.files.profilePhoto;
    const uploadPath = `uploads/profile_photos/${req.user._id}_${profilePhoto.name}`;
  
    profilePhoto.mv(uploadPath, function(err) {
      if (err) return res.status(500).send(err);
  
      User.findOneAndUpdate(
        { _id: req.user._id },
        { image: uploadPath },
        { new: true },
        (err, user) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json({
            success: true,
            profilePhotoUrl: uploadPath
          });
        }
      );
    });
  });
  
  module.exports = router;