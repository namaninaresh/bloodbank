const router = require("express").Router();
const url = require("url");
const DbService = require("../models/DataController");
const moment = require("moment");

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
  if (req.session.currentUser) {
    const Instance = DbService.getDbInstance();

    const result = Instance.getRequestData(req.session.currentUser);

    result
      .then((data) => {
        data.map(
          (element) =>
            (element.ondate = moment(
              element.ondate,
              "YYYY-MM-DDTHH:mm:ss"
            ).fromNow())
        );
        res.render("Donar/requests", {
          title: "Requests Page",
          user: req.session.currentUser,
          active: "requests",
          data,
        });
      })
      .catch((err) => console.log(err));
  } else res.redirect("/auth/login");
});
router.get("/profile", function (req, res, next) {
  if (req.session.currentUser) {
    const Instance = DbService.getDbInstance();

    const result = Instance.getProfileData(req.session.currentUser);

    // const result= Instance.getProfileData(req.session.currentUser);
    result
      .then((data) => {
        res.render("Donar/profile", {
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

router.get("/blooddonated", function (req, res, next) {
  // if (req.session.currentUser) {
  const Instance = DbService.getDbInstance();
  const result = Instance.getBloodDonatedData(req.session.currentUser);

  result
    .then((data) => {
      const result = { ...data[0][0], ...data[1][0] };
      var info = data[2];
      info.map(
        (element) =>
          (element.ondate =
            moment(element.ondate, "YYYY-MM-DDTHH:mm:ss").format("LLL") +
            " ( " +
            moment(element.ondate, "YYYY-MM-DDTHH:mm:ss").fromNow() +
            " ) ")
      );
      console.log(info);
      res.render("Donar/blooddonated", {
        title: "BloodDonated Page",
        user: req.session.currentUser,
        active: "blooddonated",
        data: result,
        info: info,
      });
    })
    .catch((err) => console.log(err));
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
      requestMsg: false,
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
        res.render("Donar/search", {
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

    result.then((data) => {
      res.render("Donar/addBlood", {
        title: "Add Blood Page",
        user: userSessionData,
        active: "addblood",
        notify: "Success",
      });
    });
  } else res.redirect("/auth/login");
});

router.get(
  "/requestEx/status=:status&id=:id&:username&userid=:userid&:requser&:requserid&group=:group&units=:units",
  function (req, res, next) {
    const userSessionData = req.session.currentUser;
    const data = {
      status: req.params.status,
      reqid: req.params.id,
      userid: req.params.userid,
      group: req.params.group,
      username: req.params.username,
      requser: req.params.requser,
      ondate: "1/1/1",
      units: req.params.units,
      requserid: req.params.requserid,
    };
    if (userSessionData) {
      const Instance = DbService.getDbInstance();

      const result = Instance.putRequestData(req.params);

      result.then((data) => {
        res.redirect("/requests");
      });
    } else res.redirect("/auth/login");
  }
);

function contSearch(req, res, next) {
  const userSessionData = req.session.currentUser;
  if (userSessionData)
    res.render("Donar/search", {
      title: "Search Page",
      user: userSessionData,
      active: "search",
      searchError: false,
      searchData: false,
      requestMsg: { message: "Requested Successfull", status: "success" },
    });
  else res.redirect("/auth/login");
}
router.get(
  "/requestBlood/:userid&:username&:bloodtype&:bloodunits&:requserid&:requser",
  function (req, res, next) {
    const userSessionData = req.session.currentUser;
    if (userSessionData) {
      const Instance = DbService.getDbInstance();

      const result = Instance.makeRequest(req.params);
      result
        .then((data) => {
          return contSearch(req, res, next);
        })
        .catch((err) => console.log(err));
    }
  }
);

router.get("/deleteuser/:id", function (req, res, next) {
  if (req.session.currentUser) {
    const Instance = DbService.getDbInstance();

    const result = Instance.deleteUser(req.params.id);

    result
      .then((data) => {
        req.session.destroy((err) => {
          res.redirect("/index");
        });
      })
      .catch((err) => console.log(err));
  }
});

router.get("/profile/edit", function (req, res, next) {
  if (req.session.currentUser) {
    const Instance = DbService.getDbInstance();
    const { userid } = req.session.currentUser;
    const result = Instance.getUser(userid);

    // const result= Instance.getProfileData(req.session.currentUser);
    result
      .then((data) => {
        res.render("Donar/profileEdit", {
          title: "Profile Page",
          user: data[0],
          active: "profile",
        });
      })
      .catch((err) => console.log(err));

    //res.render('Donar/profile',{title:"Profile Page",user: req.session.currentUser, active:"profile"});
  } else res.redirect("/auth/login");
});

router.post("/profile/edit", function (req, res) {
  if (req.session.currentUser) {
    const Instance = DbService.getDbInstance();
    console.log(req.body);
    const result = Instance.updateUser(req.body);

    result
      .then((data) => {
        res.redirect("/profile");
      })
      .catch((err) => console.log(err));
  }
});

router.get("/error", function (req, res, next) {
  const Instance = DbService.getDbInstance();

  const result = Instance.parsingDate();

  result
    .then((data) => {
      console.log(data[0]["onDateTime"]);
      res.send(moment().format("YYYY-MM-DD HH:mm:ss"));
    })
    .catch((err) => console.log(err));
});

module.exports = router;
