import {db, storage} from './firebase';

export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');

  //get 1 user
export const onceGetUser = (uid) =>
  db.ref('users').child(uid).once('value');


//query
export const onceGetUserWithName = (tName) =>
  db.ref('users').orderByChild("username").equalTo(tName).limitToFirst(1).once("value");

export const onceGetCourseWithTitle = (cTitle) =>
  db.ref('courses').orderByChild("/metadata/title").equalTo(cTitle).limitToFirst(1).once("value");


//get multiple courses
export const onceGetCourses = () =>
  db.ref('courses').limitToFirst(20).once('value');

export const onceGetPublishedCourses = () =>
  db.ref('courses').orderByChild("/metadata/isPublished").equalTo(true).limitToFirst(20).once('value');

//get 1 course
export const onceGetCourse = (courseKey) =>
  db.ref('courses').child(courseKey).once('value');

//course creation
export const doCreateCourse = (title, teacherId) =>
{
  var metadata = {
     title,
     teacherId,
     isPublished: false,
   }
  return db.ref('courses').push({metadata})
}

export const doUpdateCourseTeaching = (courseId, teacherId, title) =>
{
  var updates = {}
  updates[`users/${teacherId}/courseTeaching/${courseId}/metadata/title`] = title
  return db.ref().update(updates)
}


export const doUpdateCourseTitle = (courseKey, tid, title, subTitle) =>
{
  console.log('courseKey, tid, title, subTitle', courseKey, tid, title, subTitle);
  var updates = {}
  updates[`courses/${courseKey}/metadata/title`] = title
  updates[`courses/${courseKey}/metadata/subTitle`] = subTitle

  updates[`users/${tid}/courseTeaching/${courseKey}/metadata/title`] = title
  updates[`users/${tid}/courseTeaching/${courseKey}/metadata/subTitle`] = subTitle

  return db.ref().update(updates)
}

export const doUpdateCourseMeta = (courseKey, tid, textbook, date, time, location) => {

  var updates = {}
  updates[`courses/${courseKey}/metadata/textbook`] = textbook
  updates[`courses/${courseKey}/metadata/date`] = date
  updates[`courses/${courseKey}/metadata/time`] = time
  updates[`courses/${courseKey}/metadata/location`] = location

  updates[`users/${tid}/courseTeaching/${courseKey}/metadata/textbook`] = textbook
  updates[`users/${tid}/courseTeaching/${courseKey}/metadata/date`] = date
  updates[`users/${tid}/courseTeaching/${courseKey}/metadata/time`] = time
  updates[`users/${tid}/courseTeaching/${courseKey}/metadata/location`] = location

  return db.ref().update(updates)
}

export const doUpdateCourseCurri = (courseKey, tid, curri) => {
  var updates = {}
  updates[`courses/${courseKey}/curri/`] = curri
  return db.ref().update(updates)
}

export const doUpdateCoursePrivacy = (courseKey, tid, openCourse, password) => {
  console.log('open', courseKey, tid, openCourse, password);

  var updates = {}
  if (openCourse) {
    // console.log('tr', openCourse);
    updates[`courses/${courseKey}/metadata/openCourse`] = openCourse
    updates[`courses/${courseKey}/metadata/password`] = ''
    updates[`users/${tid}/courseTeaching/${courseKey}/metadata/openCourse`] = openCourse
    updates[`users/${tid}/courseTeaching/${courseKey}/metadata/password`] = ''
  } else {
    // console.log('false',openCourse);
    updates[`courses/${courseKey}/metadata/openCourse`] = openCourse
    updates[`courses/${courseKey}/metadata/password`] = password
    updates[`users/${tid}/courseTeaching/${courseKey}/metadata/openCourse`] = openCourse
    updates[`users/${tid}/courseTeaching/${courseKey}/metadata/password`] = password
  }

  return db.ref().update(updates)

}

//publish course
export const doPublishCourse = (courseKey, tid, isPublished) => {
  console.log('db', courseKey, isPublished);

  var updates = {}

  if (isPublished === true) {
    updates[`courses/${courseKey}/metadata/isPublished`] = false
    updates[`users/${tid}/courseTeaching/${courseKey}/metadata/isPublished`] = false
  } else {
    updates[`courses/${courseKey}/metadata/isPublished`] = true
    updates[`users/${tid}/courseTeaching/${courseKey}/metadata/isPublished`] = true
  }

  return db.ref().update(updates)
}

export const doRemoveCourse = (tid, cid) => {
  var updates = {}
  updates[`courses/${cid}/`] = null
  updates[`users/${tid}/courseTeaching/${cid}/`] = null
  return db.ref().update(updates)
}

export const doEnrollInCourse = (tid, cid, password, uid) => {
  console.log('db', tid, cid, password, uid);
  var updates = {}
  updates[`courses/${cid}/attendee/${uid}`] = 1
  updates[`users/${tid}/courseTeaching/${cid}/attendee/${uid}`] = 1
  updates[`users/${uid}/courseAttending/${tid}/${cid}`] = 1
  return db.ref().update(updates)
}

export const doSaveNewQ = (tid, cid, askedBy, title, text, createdAt, img) => {
  console.log('db', tid, cid, askedBy, title, text, createdAt, img);

  //1 where to save?
  // var updates = {}
  // updates[`courses/${courseKey}/questions/`] = textbook
  // updates[`teachers/${tid}/courseTeaching/${courseKey}/metadata/textbook`] = textbook
  // updates[`users/${uid}/questions/${courseKey}/metadata/textbook`] = textbook
  // updates[`questions/${uid}/teacher/${tid}/${qid}`] =
  // return db.ref().update()

  //2 how to save
  // updates[`questions/${tid}/${qid}/askedBy`] = askedBy
  // updates[`questions/${tid}/${qid}/title`] = title
  // updates[`questions/${tid}/${qid}/text`] = text
  // updates[`questions/${tid}/${qid}/createdAt`] = createdAt
  // updates[`questions/${tid}/${qid}/courseId`] = cid

  return db.ref('questions').child(tid).push({tid, cid, askedBy, title, text, createdAt})
}

export const doSaveAnswer = (tid, cid, qid, answeredBy, text, createdAt, img) => {
  console.log('db', tid, cid, qid, answeredBy, text, createdAt, img);
  var answer = {answeredBy, text, createdAt, img}
  return db.ref('questions').child(tid).child(qid).child('answers').push(answer)
}

export const doFetchRecentQuestions = (tid) => {
  return db.ref('questions').child(tid).limitToFirst(10).once('value')
}

export const doSearchForQuestions = (tid, queryText) => {
  return db.ref('questions').child(tid).orderByChild('title').startAt(queryText).endAt(queryText+"\uf8ff").once('value')
}


export const doProfileImgUpload = (file) => {
  // console.log('file', file);
  return storage.put(file)
  // return db.ref('questions').child(tid).orderByChild('title').startAt(queryText).endAt(queryText+"\uf8ff").once('value')
}
