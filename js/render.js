var paused = false;
var playerLost = false;
var guiLoaded = false;
var planeBulletlastTime = new Date().getTime();
var enemyPlaneLastTime = new Date().getTime();
var enemyPlaneSingleLineGrouptLastTime = new Date().getTime();
var planeBulletSeconds = 0;
var enemyPlaneSeconds = 0;
var enemyPlaneSingleLineGroupSeconds = 0;
var cloudObjectLastTime = new Date().getTime();
var cloudObjectLastSeconds = 0;
var backgroundObjectsLastTime = new Date().getTime();
var backgroundObjectsLastSeconds = 0;
var gainObjectLastTime = new Date().getTime();
var gainObjectLastSeconds = 0;
var enemyTankLastTime = new Date().getTime();
var enemyTankSeconds = 0;

window.onload = async function () {
  adventurePreload();
  const render = function (time) {
    var timeInSeconds = time * 0.001;
    var currentTime = new Date().getTime();
    context.clearRect(0, 0, webgl.width, webgl.height);

    guiLoaded =
      backgroundObjectsInstance.length >= 100
        ? true
        : (backgroundObjectsInstanceFunction instanceof Function
            ? backgroundObjectsInstanceFunction()
            : false,
          false);

    if (
      currentTime - planeBulletlastTime >= 70 &&
      !playerLost &&
      !paused &&
      guiLoaded
    ) {
      planeBulletlastTime = currentTime;
      planeBulletSeconds++;
      if (backgroundObjectsInstanceFunction instanceof Function)
        planeBulletObjectInstanceFunction();
    }

    if (
      currentTime - enemyTankLastTime >= 700 &&
      !playerLost &&
      !paused &&
      guiLoaded
    ) {
      enemyTankLastTime = currentTime;
      enemyTankSeconds++;
      if (enemyPlaneObjectInstance.length < 15)
        enemyPlaneObjectInstanceFunction();
      enemyTankObjectInstanceFunction();
    }
    if (
      currentTime - enemyPlaneSingleLineGrouptLastTime >= 2500 &&
      !playerLost &&
      !paused &&
      guiLoaded
    ) {
      enemyPlaneSingleLineGrouptLastTime = currentTime;
      enemyPlaneSingleLineGroupSeconds++;
      enemyUfoSingleLineGroupObjectInstanceFunction();
    }
    /* cloud */
    if (
      currentTime - cloudObjectLastTime >= 1000 &&
      !playerLost &&
      !paused &&
      guiLoaded
    ) {
      cloudObjectLastTime = currentTime;
      cloudObjectLastSeconds++;
      cloudObjectInstanceFunction();
    }

    /* gains object */
    if (
      currentTime - gainObjectLastTime >= 500 &&
      !playerLost &&
      !paused &&
      guiLoaded
    ) {
      gainObjectLastTime = currentTime;
      gainObjectLastSeconds++;
      peopleRescueInstanceFunction();
      boxesInstanceFunction();
    }

    if (guiLoaded) {
      backgroundObjectInstance.draw();
      if (!paused) backgroundObjectInstance.scroll();
      for (var i = backgroundObjectsInstance.length; i--; ) {
        backgroundObjectsInstance[i].draw();
        backgroundObjectsInstance[i].scroll();
      }
    }

    /* Rescue */
    for (var i = peopleRescueInstance.length; i--; ) {
      peopleRescueInstance[i].draw(timeInSeconds);
      if (!paused) {
        if (peopleRescueInstance[i].scroll()) {
          peopleRescueInstance.splice(i, 1);
        }

        if (planeObjectInstance.peopleRescue(peopleRescueInstance[i])) {
          peopleRescueInstance.splice(i, 1);
        }
      }
    }

    /* Boxes */
    for (var i = boxesInstance.length; i--; ) {
      boxesInstance[i].draw(timeInSeconds);
      if (!paused) {
        if (boxesInstance[i].scroll()) {
          boxesInstance.splice(i, 1);
        }

        if (planeObjectInstance.boxes(boxesInstance[i])) {
          boxesInstance.splice(i, 1);
        }
      }
    }

    /* Tanks */
    for (var i = enemyTankObjectInstance.length; i--; ) {
      enemyTankObjectInstance[i].draw();
      enemyTankObjectInstance[i].bullet();
      if (!paused) {
        if (enemyTankObjectInstance[i].bulletfire(planeObjectInstance)) {
          planeObjectInstance.lives -= 0.8;
          enemyTankObjectInstance[i].reset();
        }

        if (enemyTankObjectInstance[i].drive()) {
          enemyTankObjectInstance.splice(i, 1);
        }
        for (var j = planeBulletObjectInstance.length; j--; ) {
          if (
            planeBulletObjectInstance[j].bulletHitsEnemyVehicle(
              enemyTankObjectInstance[i]
            )
          ) {
            enemyExplosionInstance.draw(
              timeInSeconds,
              enemyTankObjectInstance[i].x,
              enemyTankObjectInstance[i].y
            );
            planeBulletObjectInstance.splice(j, 1);
            enemyTankObjectInstance.splice(i, 1);
          }
        }

        if (planeObjectInstance.hitsEnemy(enemyTankObjectInstance[i])) {
          enemyExplosionInstance.draw(
            timeInSeconds,
            enemyTankObjectInstance[i].x,
            enemyTankObjectInstance[i].y
          );
          enemyTankObjectInstance.splice(i, 1);
        }
      }
    }

    /* enemy plane here */
    for (var i = enemyPlaneObjectInstance.length; i--; ) {
      enemyPlaneObjectInstance[i].draw();
      if (!paused) {
        if (enemyPlaneObjectInstance[i].fly()) {
          if (!playerLost) enemyPlaneObjectInstance[i].reset();
        }

        for (var j = planeBulletObjectInstance.length; j--; ) {
          if (
            planeBulletObjectInstance[j].bulletHitsEnemyVehicle(
              enemyPlaneObjectInstance[i]
            )
          ) {
            enemyExplosionInstance.draw(
              timeInSeconds,
              enemyPlaneObjectInstance[i].x,
              enemyPlaneObjectInstance[i].y
            );
            planeBulletObjectInstance.splice(j, 1);
            enemyPlaneObjectInstance[i].reset();
          }
        }

        for (var j = powerPlanesObjectInstance.length; j--; ) {
          if (
            powerPlanesObjectInstance[j].hitsEnemy(enemyPlaneObjectInstance[i])
          ) {
            enemyExplosionInstance.draw(
              timeInSeconds,
              enemyPlaneObjectInstance[i].x,
              enemyPlaneObjectInstance[i].y
            );
            enemyPlaneObjectInstance[i].reset();
            enemyExplosionInstance.draw(
              timeInSeconds,
              enemyPlaneObjectInstance[i].x,
              enemyPlaneObjectInstance[i].y
            );
            powerPlanesObjectInstance.splice(j, 1);
          }
        }

        if (planeObjectInstance.hitsEnemy(enemyPlaneObjectInstance[i])) {
          enemyExplosionInstance.draw(
            timeInSeconds,
            enemyPlaneObjectInstance[i].x,
            enemyPlaneObjectInstance[i].y
          );
          enemyPlaneObjectInstance[i].reset();
        }
      }
    }

    /* Single Groupt Enemy here */
    for (var i = enemyUfoSingleLineGroupObjectInstance.length; i--; ) {
      enemyUfoSingleLineGroupObjectInstance[i].draw();
      if (!paused) {
        if (enemyUfoSingleLineGroupObjectInstance[i].fly()) {
          enemyUfoSingleLineGroupObjectInstance.splice(i, 1);
        }

        for (var j = planeBulletObjectInstance.length; j--; ) {
          if (
            planeBulletObjectInstance[j].bulletHitsEnemyVehicle(
              enemyUfoSingleLineGroupObjectInstance[i]
            )
          ) {
            enemyExplosionInstance.draw(
              timeInSeconds,
              enemyUfoSingleLineGroupObjectInstance[i].x,
              enemyUfoSingleLineGroupObjectInstance[i].y
            );
            planeBulletObjectInstance.splice(j, 1);
            enemyUfoSingleLineGroupObjectInstance.splice(i, 1);
          }
        }

        if (
          planeObjectInstance.hitsEnemy(
            enemyUfoSingleLineGroupObjectInstance[i]
          )
        ) {
          enemyExplosionInstance.draw(
            timeInSeconds,
            enemyUfoSingleLineGroupObjectInstance[i].x,
            enemyUfoSingleLineGroupObjectInstance[i].y
          );
          enemyUfoSingleLineGroupObjectInstance.splice(i, 1);
        }

        for (var j = powerPlanesObjectInstance.length; j--; ) {
          if (
            powerPlanesObjectInstance[j].hitsEnemy(
              enemyUfoSingleLineGroupObjectInstance[i]
            )
          ) {
            enemyExplosionInstance.draw(
              timeInSeconds,
              enemyUfoSingleLineGroupObjectInstance[i].x,
              enemyUfoSingleLineGroupObjectInstance[i].y
            );

            enemyUfoSingleLineGroupObjectInstance.splice(i, 1);

            enemyExplosionInstance.draw(
              timeInSeconds,
              powerPlanesObjectInstance[j].x,
              powerPlanesObjectInstance[j].y
            );
            powerPlanesObjectInstance.splice(j, 1);
          }
        }
      }
    }

    if (guiLoaded) {
      for (var i = planeBulletObjectInstance.length; i--; ) {
        planeBulletObjectInstance[i].draw();
        if (planeBulletObjectInstance[i].animate()) {
          planeBulletObjectInstance.splice(i, 1);
        }
      }

      playerLost = planeObjectInstance.stats();

      /* Cloud Object here */
      for (var i = cloudObjectInstance.length; i--; ) {
        cloudObjectInstance[i].draw();
        if (!paused) cloudObjectInstance[i].animate();
      }
      !playerLost
        ? planeObjectInstance.draw(timeInSeconds)
        : (alertMessage("You Lose"),
          (() => {
            throw "You Lose";
          })());
      for (var i = powerPlanesObjectInstance.length; i--; ) {
        powerPlanesObjectInstance[i].draw();
        if (!paused) {
          if (powerPlanesObjectInstance[i].attack()) {
            powerPlanesObjectInstance.splice(i, 1);
          }
        }
      }
      planeObjectInstance.drive(driveUp, driveDown, driveLeft, driveRight);
    }
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
};
