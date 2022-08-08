const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const cors = require('cors');
const middlewares = jsonServer.defaults()

const data = require('./db.json')
const staffData = data.staff
const medicationData = data.medication
const notificationData = data.notification
const teamsData = data.teams

const ts_japi = require('ts-japi')
const Linker = ts_japi.Linker
const Serializer = ts_japi.Serializer
const Relator = ts_japi.Relator
const Metaizer = ts_japi.Metaizer
const Paginator = ts_japi.Paginator

const port = 4000
const domain = `http://localhost:${port}`
const pathTo = path => domain + path

var StaffLinker = new Linker((staff) => {
  return Array.isArray(staff) ? pathTo("/staff/") : pathTo("/staff/".concat(staff.id));
});

const StaffPaginator = new Paginator((staff) => {
  if (Array.isArray(staff)) {
    const nextPage = Number(staff[staff.length - 1].id) + 1;
    const prevPage = Number(staff[0].id) - 1;
    return {
      first: pathTo(`/staff/${staffData[0].id}`),
      last: pathTo(`/staff/${staffData[staffData.length - 1].id}`),
      next: (nextPage < staffData.length) ? pathTo(`/staff/${nextPage}`) : null,
      prev: (prevPage > 0) ? pathTo(`/staff/${prevPage}`) : null
    };
  }
  return;
});

const MedicationMetaizer = new Metaizer((staff) => {
  return Array.isArray(staff)
    ? { validation: pathTo("/validation/medication") }
    : { validation: pathTo(`/validation/medication/${staff.id}`) };
});

const MedicationSerializer = new Serializer('medication', {
  metaizers: {
    document: MedicationMetaizer
  }
});

const NotificationSerializer = new Serializer('notification');
const ShiftSerializer = new Serializer('shift');

const StaffNotificationsRelationshipLinker = new Linker((staff, notifications) =>
  Array.isArray(notifications)
    ? pathTo(`/staff/${staff.id}/relationships/notifications/`)
    : pathTo(`/staff/${staff.id}/relationships/notifications/${notifications.id}`)
);

const StaffNotificationsLinker = new Linker((staff, notifications) =>
  Array.isArray(notifications)
    ? pathTo(`/staff/${staff.id}/notifications/`)
    : pathTo(`/staff/${staff.id}/notifications/${notifications.id}`)
);

const StaffNotificationsRelator = new Relator(
  (staffMember) => {
    const memberColors = new Set(
      teamsData.filter(team => (
        team.members.includes(staffMember.id)
      )).map(team => team.color)
    )
    return notificationData.filter(notification => (
      memberColors.has(notification.color)
    ))
  },
  NotificationSerializer,
  {
    linkers: {
      relationship: StaffNotificationsRelationshipLinker,
      related: StaffNotificationsLinker
    }
  }
)

const StaffMetaizer = new Metaizer((staff) => {
  return Array.isArray(staff)
    ? { validation: pathTo("/validation/staff") }
    : { validation: pathTo(`/validation/staff/${staff.id}`) };
});

const StaffSerializer = new Serializer('staff', {
  depth: 1,
  linkers: {
    resource: StaffLinker,
    paginator: StaffPaginator
  },
  relators: StaffNotificationsRelator,
  metaizers: {
    document: StaffMetaizer
  }
});

server.use(
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
);
server.options('*', cors());

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

const getTokens = path => path.toLowerCase().split('/')

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  // console.log(req.path, getTokens(req.path))
  if (getTokens(req.path).some(token => token.startsWith("relationships"))) {
    req.body.showRelationships = true;
  }
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

const staffResponse = async (res) => {
  const staffList = res.locals.data
  res.jsonp(await StaffSerializer.serialize(staffList))
};

const shiftResponse = async (res) => {
  const shiftList = res.locals.data
  res.jsonp(await ShiftSerializer.serialize(shiftList))
};

const notificationResponse = async (res) => {
  const notificationList = res.locals.data
  res.jsonp(await NotificationSerializer.serialize(notificationList))
};

const medicationResponse = async (res) => {
  const medicationList = res.locals.data
  res.jsonp(await MedicationSerializer.serialize(medicationList))
};

router.render = (req, res) => {
  const path = getTokens(req.path).map(token => (
    token.split('?')[0]
  ))
  //console.log(res.locals.data)
  if (path[1] === 'staff') {
    staffResponse(res)
  } else if (path[1] === 'shift') {
    shiftResponse(res)
  } else if (path[1] === 'medication') {
    medicationResponse(res)
  } else if (path[1] === 'notification') {
    notificationResponse(res)
  } else {
    if (Object.keys(data).includes(path[1])) {
      res.jsonp(res.locals.data)
    } else {
      res.status(404).jsonp({
        error: "Not found"
      })
    }
  }
}

// Add this before server.use(router)
server.use(jsonServer.rewriter({
  '/:resource/:id/relationships': '/:resource/:id',
  "/validation/:category": "/validation?category=:category"
}))

// Use default router
server.use(router)
server.listen(port, () => {
  console.log('JSON Server is running')
})
