const {
  getAllLaunches, 
  ScheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require('../../models/launches.model');

const {getPagination} = require('../../services/query');

async function httpGetAllLaunches(req, res) {
  const {skip,limit} = getPagination(req.query);
  return res.status(200).json(await getAllLaunches(skip,limit));
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      '💬': 'Missing required launch property',
    });
  }

  // make the launchDate Date object
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      '💬': 'Invalid launch date',
    });
  }
  try {
    await ScheduleNewLaunch(launch);
    return res.status(201).json(launch);
  } catch (err) {
    return res.status(400).json({
      '💬': 'Error: Launch already exists',
    });
  }
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  // if launchId is not exist
  const existsLaunch = await existsLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({
      '💬': 'Launch not found',
    });
  }

  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      '💬': 'Launch not aborted',
    });
  }

  return res.status(200).json({
    '💬': 'Launch aborted',
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
