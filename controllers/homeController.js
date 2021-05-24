const router = require("express").Router();

const DbService = require("../models/DataController");
const moment = require("moment");

var InstanceOfDb = undefined;

//Home Route
router.get("/", function (req, res, next) {
  const userSessionData = req.session.currentUser;
  if (userSessionData) {
    InstanceOfDb == undefined && (InstanceOfDb = DbService.getDbInstance());

    const result = InstanceOfDb.getHomeData();

    result.then((data) => {
      res.render("App/Home", {
        title: "Home Page",
        active: "home",
        user: userSessionData,
        availableBlood: data,
      });
    });
  } else res.redirect("/index");
});

//Request Page Route
router.get("/requests", function (req, res, next) {
  if (req.session.currentUser) {
    // const Instance = DbService.getDbInstance();

    const result = InstanceOfDb.getRequestData(req.session.currentUser);

    result
      .then((data = result[0]) => {
        data[0].map(
          (element) =>
            (element.ondate = moment(
              element.ondate,
              "YYYY-MM-DDTHH:mm:ss"
            ).fromNow())
        );

        res.render("App/requests", {
          title: "Requests Page",
          user: req.session.currentUser,
          active: "requests",
          data: data[0],
          users: data[1],
        });
      })
      .catch((err) => console.log(err));
  } else res.redirect("/auth/login");
});

//Blood Donated Page Route
router.get("/blooddonated", function (req, res, next) {
  // if (req.session.currentUser) {

  if (req.session.currentUser.role !== "donar") {
    res.redirect("/");
  }
  //const Instance = DbService.getDbInstance();
  const result = InstanceOfDb.getBloodDonatedData(req.session.currentUser);

  result
    .then((data) => {
      const result = { ...data[0][0], ...data[1][0] };
      var info = data[2];
      info.map(
        (element) =>
          (element.ondate = moment(
            element.ondate,
            "YYYY-MM-DDTHH:mm:ss"
          ).fromNow())
      );
      console.log(info);
      res.render("App/blooddonated", {
        title: "BloodDonated Page",
        user: req.session.currentUser,
        active: "blooddonated",
        data: result,
        info: info,
      });
    })
    .catch((err) => console.log(err));
});

//Search Page Route
router.get("/search", function (req, res, next) {
  const userSessionData = req.session.currentUser;
  if (userSessionData)
    res.render("App/search", {
      title: "Search Page",
      user: userSessionData,
      active: "search",
      searchError: false,
      searchData: false,
      requestMsg: false,
    });
  else res.redirect("/auth/login");
});

//Search Page Route with POst REquest (when user searched)
router.post("/search", function (req, res, next) {
  const userSessionData = req.session.currentUser;

  if (userSessionData) {
    //const Instance = DbService.getDbInstance();

    const result = InstanceOfDb.getSearchData(req.body);

    result
      .then((data) => {
        res.render("App/search", {
          title: "Search Page",
          user: userSessionData,
          requestData: req.body,
          active: "search",
          searchError: false,
          searchData: data,
          requestMsg: false,
        });
      })
      .catch((err) => console.log(err));
  } else res.redirect("/auth/login");
});

//Add Blood Page Route
router.get("/addblood", function (req, res, next) {
  if (req.session.currentUser.role !== "donar") {
    res.redirect("/");
  }
  const userSessionData = req.session.currentUser;
  if (userSessionData)
    res.render("App/addBlood", {
      title: "Add Blood Page",
      user: userSessionData,
      active: "addblood",
      notify: false,
    });
  else res.redirect("/auth/login");
});

//Add Blood Page Route with Post Request (when user added BLood)
router.post("/addblood", function (req, res, next) {
  const userSessionData = req.session.currentUser;
  if (userSessionData) {
    //const Instance = DbService.getDbInstance();
    const result = InstanceOfDb.addBlood(req.body, req.session.currentUser);

    result.then((data) => {
      res.render("App/addBlood", {
        title: "Add Blood Page",
        user: userSessionData,
        active: "addblood",
        notify: "Success",
      });
    });
  } else res.redirect("/auth/login");
});

//Changing Request Data
router.get(
  "/requestEx/status=:status&reqid=:reqid&:username&userid=:userid&:requser&:requserid&group=:group&units=:units",
  function (req, res, next) {
    const userSessionData = req.session.currentUser;

    if (userSessionData) {
      // const Instance = DbService.getDbInstance();

      const result = InstanceOfDb.putRequestData(req.params);

      result.then((data) => {
        res.redirect("/requests");
      });
    } else res.redirect("/auth/login");
  }
);

//Requesting BLood with Get Resquest
router.get(
  "/requestBlood/:userid&:username&:bloodtype&:bloodunits&:requserid&:requser",
  function (req, res, next) {
    const userSessionData = req.session.currentUser;
    if (userSessionData) {
      // const Instance = DbService.getDbInstance();

      const result = InstanceOfDb.makeRequest(req.params);
      result
        .then((data) => {
          return contSearch(req, res, next);
        })
        .catch((err) => console.log(err));
    }
  }
);
//when Requesting Blood Done , contSearch Renders
function contSearch(req, res, next) {
  const userSessionData = req.session.currentUser;
  if (userSessionData)
    res.render("App/search", {
      title: "Search Page",
      user: userSessionData,
      active: "search",
      searchError: false,
      searchData: false,
      requestMsg: { message: "Requested Successfull", status: "success" },
    });
  else res.redirect("/auth/login");
}

//Profile Page Route
router.get("/profile", function (req, res, next) {
  if (req.session.currentUser) {
    //const Instance = DbService.getDbInstance();

    const result = InstanceOfDb.getProfileData(req.session.currentUser);

    // const result= Instance.getProfileData(req.session.currentUser);
    result
      .then((data) => {
        res.render("App/profile", {
          title: "Profile Page",
          user: req.session.currentUser,
          active: "profile",
          userdata: data[0][0],
          donated: data[1][0],
          available: data[2],
        });
      })
      .catch((err) => console.log(err));

    //res.render('Donar/profile',{title:"Profile Page",user: req.session.currentUser, active:"profile"});
  } else res.redirect("/auth/login");
});

//Profile Edit Page
router.get("/profile/edit", function (req, res, next) {
  if (req.session.currentUser) {
    //const Instance = DbService.getDbInstance();
    const { userid } = req.session.currentUser;
    const result = InstanceOfDb.getUser(userid);

    // const result= Instance.getProfileData(req.session.currentUser);
    result
      .then((data) => {
        res.render("App/profileEdit", {
          title: "Profile Page",
          user: data[0],
          active: "profile",
        });
      })
      .catch((err) => console.log(err));

    //res.render('Donar/profile',{title:"Profile Page",user: req.session.currentUser, active:"profile"});
  } else res.redirect("/auth/login");
});

//Profile Update with user Details
router.post("/profile/edit", function (req, res) {
  if (req.session.currentUser) {
    // const Instance = DbService.getDbInstance();

    const result = InstanceOfDb.updateUser(req.body);

    result
      .then((data) => {
        res.redirect("/profile");
      })
      .catch((err) => console.log(err));
  }
});

//Profile Updating with Password Change
router.post("/profile/password", function (req, res) {
  if (req.session.currentUser) {
    //const Instance = DbService.getDbInstance();

    const result = InstanceOfDb.changePassword(req.body);

    result
      .then((data) => {
        res.redirect("/profile");
      })
      .catch((err) => console.log(err));
  }
});

// Deleting User
router.get("/deleteuser/:id", function (req, res, next) {
  if (req.session.currentUser) {
    //const Instance = DbService.getDbInstance();

    const result = InstanceOfDb.deleteUser(req.params.id);

    result
      .then((data) => {
        req.session.destroy((err) => {
          res.redirect("/index");
        });
      })
      .catch((err) => console.log(err));
  }
});

module.exports = router;
