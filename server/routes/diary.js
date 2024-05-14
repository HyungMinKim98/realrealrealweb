//server>routes>diary.js

const express = require('express');
const router = express.Router();
const { Diary } = require("../models/Diary");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const { message } = require('antd');

// 파일 저장을 위한 Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 파일이 저장될 서버 상의 경로
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // 파일명 설정
  }
});


// 파일 필터 설정
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  console.log("Uploaded file extension:", ext); // 파일 확장자 로깅
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    cb(new Error('Only jpg, jpeg, and png are allowed'), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single("file");

//=================================
//             Video
//=================================

//클라이언트 요청이 먼저 서버의 index.js로 와서 /api/video 이부분은 안 써도 됨

// 파일 업로드 엔드포인트
router.post('/uploadfiles', (req, res) => {
  upload(req, res, err => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({ success: false, err });
    }
    console.log('File uploaded successfully', req.file); // 성공적으로 업로드된 파일 정보 로깅
    return res.json({ success: true, url: req.file.path, fileName: req.file.filename });
  });
});

// 일기 업로드 엔드포인트
router.post('/uploadDiary', (req, res) => {
  console.log('Received data:', req.body);
  const diary = new Diary({
      writer: req.body.writer,
      title: req.body.title,
      description: req.body.description,
      privacy: parseInt(req.body.privacy, 10),
      category: parseInt(req.body.category, 10),
      genre: parseInt(req.body.genre, 10),
      rating: parseInt(req.body.rating, 10),
      filePath: req.file ? req.file.path : '',
      fileName: req.file ? req.file.filename : ''
  });
  // diary.save((err, doc) => {
//       if (err) {
//           console.error("Error saving diary:", err);
//           return res.status(400).json({ success: false, message: "Failed to save diary", error: err.message });
//       }
//       res.status(200).json({ success: true, doc });
//   });
// });

diary.save((err, doc) => {
  if (err) {
    console.error("Error saving diary:", err);
    return res.status(400).json({ success: false, message: "Failed to save diary", error: err.message });
  }
  res.status(200).json({ success: true, doc });
});
});

// 일기 상세 정보 엔드포인트
router.post("/getDiaryDetail", (req, res) => {
    Diary.findOne({ "_id": req.body.diaryId })
      .populate('writer')
      .exec((err, diaryDetail) => {
        if (err) return res.status(400).send({ success: false, err });
        return res.status(200).json({ success: true, diaryDetail });
      });
  });
//일기 수정
  router.post('/updateDiary', (req, res) => {
    Diary.findOneAndUpdate(
      { "_id": req.body.diaryId },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          privacy: req.body.privacy,
          category: req.body.category,
          genre: req.body.genre,
          rating: req.body.rating,
          filePath: req.body.filePath
        }
      },
      { new: true }, // Return the updated document
      (err, doc) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, doc });
      }
    );
  });

// 전체 일기 목록 엔드포인트
router.get('/getDiarys', (req, res) => {
    Diary.find()
      .populate('writer')
      .exec((err, diarys) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, diarys });
      });
  });

module.exports = router;