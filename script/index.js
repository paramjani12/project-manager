var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var proDBName = "PROJECT-DB";
var proRelName = "ProjectData";
var connToken = "90931964|-31949300545678264|90960432";

$("#proID").focus();
$("#save").prop("disabled", true);
$("#change").prop("disabled", true);
$("#reset").prop("disabled", true);

function saveRecordOnLS(jsonObj) {
  var lvData = JSON.parse(jsonObj.data);
  localStorage.setItem("recordNumer", lvData.rec_no);
}

function getProIdAsJsonObj() {
  var proID = $("#proID").val();
  var jsonStr = {
    id: proID,
  };
  return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
  saveRecordOnLS(jsonObj);
  var record = JSON.parse(jsonObj.data).record;
  $("#proName").val(record.name);
  $("#proPerson").val(record.person);
  $("#proDate").val(record.date);
  $("#proDeadline").val(record.deadline);
}

function resetForm() {
  $("#proID").val("");
  $("#proName").val("");
  $("#proPerson").val("");
  $("#proDate").val("");
  $("#proDeadline").val("");
  $("#proID").prop("disabled", false);
  $("#save").prop("disabled", true);
  $("#change").prop("disabled", true);
  $("#reset").prop("disabled", true);
  $("#proID").focus();
}

function validateData() {
  var proID = $("#proID").val();
  var proName = $("#proName").val();
  var proPerson = $("#proPerson").val();
  var proDate = $("#proDate").val();
  var proDeadline = $("#proDeadline").val();

  if (proID === "") {
    alert("Project ID Required");
    $("#proID").focus();
    return "";
  }
  if (proName === "") {
    alert("Project Name Required");
    $("#proName").focus();
    return "";
  }
  if (proPerson === "") {
    alert("Assigned Person Required");
    $("#proPerson").focus();
    return "";
  }
  if (proDate === "") {
    alert("Project Date Required");
    $("#proDate").focus();
    return "";
  }
  if (proDeadline === "") {
    alert("Project Deadline Required");
    $("#proDeadline").focus();
    return "";
  }
  var jsonStrObj = {
    id: proID,
    name: proName,
    person: proPerson,
    date: proDate,
    deadline: proDeadline,
  };
  return JSON.stringify(jsonStrObj);
}

function getPro() {
  var proIdJsonObj = getProIdAsJsonObj();
  var getRequest = createGET_BY_KEYRequest(
    connToken,
    proDBName,
    proRelName,
    proIdJsonObj
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    getRequest,
    jpdbBaseURL,
    jpdbIRL
  );
  jQuery.ajaxSetup({ async: true });
  if (resJsonObj.status === 400) {
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#proName").focus();
  } else if (resJsonObj.status === 200) {
    $("#proID").prop("disabled", true);
    fillData(resJsonObj);
    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#proName").focus();
  }
}

function saveData() {
  var jsonStrObj = validateData();
  if (jsonStrObj === "") {
    return "";
  }
  var putRequest = createPUTRequest(
    connToken,
    jsonStrObj,
    proDBName,
    proRelName
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    putRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  resetForm();
  $("proID").focus();
}

function changeData() {
  $("#change").prop("disabled", true);
  jsonChg = validateData();
  var updateRequest = createUPDATERecordRequest(
    connToken,
    jsonChg,
    proDBName,
    proRelName,
    localStorage.getItem("recordNumer")
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    updateRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  resetForm();
  $("#proID").focus();
}

