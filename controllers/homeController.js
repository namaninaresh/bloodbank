const router = require("express").Router();

const DbService = require("../models/DataController");

router.get("/", function (req, res, next) {
  const userSessionData = req.session.currentUser;
  if (userSessionData) {
    const Instance = DbService.getDbInstance();

    const result = Instance.getHomeData();

    result.then((data) => {
      res.render("Donar/Home", {
        title: "Donar Home",
        active: "home",
        user: userSessionData,
        availableBlood: data,
      });
    });
  } else res.redirect("/auth/login");
});

router.get("/requests", function (req, res, next) {
  if (req.session.currentUser)
    res.render("Donar/requests", {
      title: "Requests Page",
      user: req.session.currentUser,
      active: "requests",
    });
  else res.redirect("/auth/login");
});
router.get("/profile", function (req, res, next) {
  if (req.session.currentUser) {
    const Instance = DbService.getDbInstance();

    const result = Instance.getProfileData(req.session.currentUser);
    // const result= Instance.getProfileData(req.session.currentUser);
    result
      .then((data) =>
        res.render("Donar/profile", {
          title: "Profile Page",
          user: req.session.currentUser,
          active: "profile",
          userdata: data[0][0],
          donated: data[1][0],
          available: data[2],
        })
      )
      .catch((err) => console.log(err));

    //res.render('Donar/profile',{title:"Profile Page",user: req.session.currentUser, active:"profile"});
  } else res.redirect("/auth/login");
});

router.get("/blooddonated", function (req, res, next) {
  if (req.session.currentUser)
    res.render("Donar/blooddonated", {
      title: "BloodDonated Page",
      user: req.session.currentUser,
      active: "blooddonated",
    });
  else res.redirect("/auth/login");
});

router.get("/search", function (req, res, next) {
  const userSessionData = req.session.currentUser;
  if (userSessionData)
    res.render("Donar/search", {
      title: "Search Page",
      user: userSessionData,
      active: "search",
      searchError: false,
      searchData: false,
    });
  else res.redirect("/auth/login");
});

router.post("/search", function (req, res, next) {
  const userSessionData = req.session.currentUser;

  if (userSessionData) {
    const Instance = DbService.getDbInstance();

    const result = Instance.getSearchData(req.body);

    result
      .then((data) => {
        console.log(data);
        res.render("Donar/search", {
          title: "Search Page",
          user: userSessionData,
          active: "search",
          searchError: false,
          searchData: data,
        });
      })
      .catch((err) => console.log(err));
  } else res.redirect("/auth/login");

  // console.log(req.body);
  // const dataJson = [
  //   { username: "chinna", bloodType: "AB+", units: 100 },
  //   { username: "A", bloodType: "AB+", units: 50 },
  //   { username: "B", bloodType: "AB+", units: 500 },
  //   { username: "blood Bank OP ", bloodType: "AB+", units: 250 },
  // ];

  // const userSessionData = req.session.currentUser;
  // if (userSessionData)
  //   res.render("Donar/search", {
  //     title: "Search Page",
  //     user: userSessionData,
  //     active: "search",
  //     searchError: false,
  //     searchData: dataJson,
  //   });
  // else res.redirect("/auth/login");
});

router.get("/addblood", function (req, res, next) {
  const userSessionData = req.session.currentUser;
  if (userSessionData)
    res.render("Donar/addBlood", {
      title: "Add Blood Page",
      user: userSessionData,
      active: "addblood",
      notify: false,
    });
  else res.redirect("/auth/login");
});

router.post("/addblood", function (req, res, next) {
  const userSessionData = req.session.currentUser;
  if (userSessionData) {
    const Instance = DbService.getDbInstance();
    const result = Instance.addBlood(req.body, req.session.currentUser);
    result
      .then((data) => {
        res.render("Donar/addBlood", {
          title: "Add Blood Page",
          user: userSessionData,
          active: "addblood",
          notify: "Success",
        });
      })
      .catch((err) => console.log(err));
  } else res.redirect("/auth/login");
});
module.exports = router;
