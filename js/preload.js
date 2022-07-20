const appdiv = document.getElementById("game-app");
var webgl = document.getElementById("webgl");
const context = webgl.getContext("2d");

const primaryWidth = webgl.getBoundingClientRect().width;
const primaryHeight = webgl.getBoundingClientRect().height;
webgl.width = primaryWidth;
webgl.height = primaryHeight;

var requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;
var cancelAnimationFrame =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame;
var uiInstance;
var pauseUiInstance;
var backgroundObjectInstance;
var backgroundObjectsInstance = [];
var backgroundObjectsInstanceFunction;
var cloudObjectInstance = [];
var cloudObjectInstanceFunction;
var planeObjectInstance;
var planeBulletObjectInstance = [];
var planeBulletObjectInstanceFunction;
var enemyPlaneObjectInstance = [];
var enemyPlaneObjectInstanceFunction;
var enemyExplosionInstance;
var enemyTankObjectInstance = [];
var enemyTankObjectInstanceFunction;
var enemyUfoSingleLineGroupObjectInstance = [];
var enemyUfoSingleLineGroupObjectInstanceFunction;
var peopleRescueInstance = [];
var peopleRescueInstanceFunction;
var boxesInstance = [];
var boxesInstanceFunction;
var powerPlanesObjectInstance = [];
var powerPlanesObjectInstanceFunction;

var playerBulletImage = "";
var powerPlaneLastTime = new Date().getTime();
var powerPlaneSeconds = 0;
var percentCompleted = 0;

var background = "01";
var object = background;
var plane = "01";
var bullet = "04";
var loc = "01";

const adventurePreload = async function () {
  cloudObjectInstanceFunction = await async function () {
    await loadImageFolder(`gui/userinterface/cloud/`).then((cloudImages) => {
      if (probability() > 0.5) {
        cloudObjectInstance.push(new CloudObjects(context, cloudImages));
      }
    });
  };

  await loadImage(`gui/backgrounds/bg/${background}.png`).then(
    (backgroundObjectInstanceImage) => {
      backgroundObjectInstance = new BackgroundObject(
        context,
        backgroundObjectInstanceImage,
        primaryWidth,
        primaryHeight
      );
    }
  ),
    await loadImageFolder(`gui/backgrounds/obj/${object}/`).then(
      (backgroundObjectsInstanceImages) => {
        backgroundObjectsInstanceFunction = function () {
          backgroundObjectsInstance.push(
            new BackgroundObjects(
              context,
              backgroundObjectsInstanceImages,
              primaryWidth,
              primaryHeight
            )
          );
        };
      }
    ),
    await loadImageFolder(`gui/players/copters/${plane}/`).then(
      async (playerPlane) => {
        await loadImage(`gui/bullets/${bullet}.png`).then(
          async (playerPlaneBullet) => {
            playerBulletImage = await playerPlaneBullet;
            await loadImage(`gui/players/bars/energy.png`).then(
              async (playerPlaneEnergy) => {
                await loadImage(`gui/players/bars/people.png`).then(
                  async (recuePeople) => {
                    planeObjectInstance = new PlaneObject(
                      context,
                      playerPlane,
                      playerPlaneEnergy,
                      recuePeople,
                      playerPlaneBullet,
                      primaryWidth,
                      primaryHeight,
                      loc
                    );
                  }
                );
              }
            );
          }
        );
      }
    ),
    (planeBulletObjectInstanceFunction = async function () {
      if (planeObjectInstance.mana > 0 && driveFire) {
        planeBulletObjectInstance.push(
          new PlaneBulletObject(
            context,
            playerBulletImage,
            planeObjectInstance.x,
            planeObjectInstance.y,
            primaryWidth,
            primaryHeight
          )
        );
        planeObjectInstance.mana -= 0.1;
      }
    }),
    (enemyPlaneObjectInstanceFunction = await async function () {
      await loadImageFolder(`gui/enemies/planes/`).then(async (enemyPlane) => {
        enemyPlaneObjectInstance.push(
          new EnemyVehicleSkyObject(
            context,
            enemyPlane,
            Math.floor(Math.random() * primaryWidth),
            probability() > 0.6
              ? Math.floor(Math.random() * 6) + 1 * 2
              : Math.floor(Math.random() * 10) + 2.5
          )
        );
      });
    });

  enemyTankObjectInstanceFunction = await async function () {
    await loadImageFolder(`gui/enemies/tanks/`).then(async (enemyTanks) => {
      await loadImage(`gui/bullets/08.png`).then((enemyTanksBullet) => {
        if (probability() > 0.6) {
          enemyTankObjectInstance.push(
            new EnemyVehicleLandObject(context, enemyTanks, enemyTanksBullet)
          );
        }
      });
    });
  };

  await loadImageFolder(`gui/userinterface/explosion/`).then(
    async (explosionImages) => {
      enemyExplosionInstance = new ExplosionObjects(context, explosionImages);
    }
  );

  enemyUfoSingleLineGroupObjectInstanceFunction = await async function () {
    await loadImageFolder(`gui/enemies/ufos/`).then(async (enemyUfos) => {
      if (probability() > 0.5) {
        var i = 0;
        var speed = Math.floor(Math.random() * 10) + 5;
        while (i < Math.trunc(primaryWidth / 52)) {
          enemyUfoSingleLineGroupObjectInstance.push(
            new EnemyVehicleSkyObject(
              context,
              enemyUfos,
              i * 49.5 + 25,
              speed,
              true
            )
          );
          i++;
        }
      }
    });
  };

  peopleRescueInstanceFunction = await async function () {
    await loadImageFolder(`gui/gains/peoples/`).then(async (peopleImages) => {
      if (probability() > 0.9) {
        var img = peopleImages;
        peopleRescueInstance.push(
          new PeopleRescue(context, [
            [img[0], img[1]],
            [img[2], img[3]],
            [img[4], img[5]],
          ])
        );
      }
    });
  };

  boxesInstanceFunction = await async function () {
    await loadImageFolder(`gui/gains/boxes/`).then(async (peopleImages) => {
      if (probability() > 0.9) {
        var img = peopleImages;
        boxesInstance.push(
          new Boxes(context, [
            [img[0], img[1]],
            [img[2], img[3]],
            [img[4], img[5]],
          ])
        );
      }
    });
  };

  powerPlanesObjectInstanceFunction = await async function () {
    await loadImageFolder(`gui/powers/planes/`).then(async (powerPlanes) => {
      powerPlaneSeconds = 0;
      const count = await async function () {
        var currentTime = new Date().getTime();
        if (currentTime - powerPlaneLastTime >= 50 && !paused) {
          powerPlaneLastTime = currentTime;
          if (powerPlaneSeconds >= 200) {
            powerPlaneSeconds = 0;
            return;
          } else {
            powerPlanesObjectInstance.push(
              new PowerPlanes(
                context,
                powerPlanes,
                Math.random() * primaryWidth,
                primaryHeight + 80
              )
            );
            powerPlaneSeconds++;
          }
        }
        requestAnimationFrame(count);
      };
      requestAnimationFrame(count);
    });
  };
};
