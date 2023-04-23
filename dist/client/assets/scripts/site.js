var xhr = new XMLHttpRequest();

$(document).ready(function () {
    // $('[data-bs-toggle="tooltip"]').tooltip();

  $('.collapse-link').on('click', function () {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function () {
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });

    // init_sidebar();




    $(".close").click(function () {
        $("#form-modal").modal('hide');
    });

    // $("#form-modal").draggableTouch({
    //     useTransform: true,
    //     ID: "#form-modal .modal-header"
    // });

    $("#BtnChangePassword").click(function () {

        showInPopup('/Users/ChangePassword', 'Change Password');
    });
    // init_charts();

    // $("#loaderbody").addClass("hide");
    // // UpdateAppointments();
    // // UpdatePendingAppointments();
    // // UpdateTodo();


    // var currentDate = new Date();

    // SubmitProceduresData();
    // SubmitProcedureTypesData();

    // SubmitMedicationsData();
    // SubmitMedicationTypesData();

    // SubmitUsersData();

    // SubmitPatientsData();
    // SubmitAppointmentsData();

    // SubmitRecieptData();

    // SubmitCreateTodo();
    // SubmitChangePassword();

    // SubmitPrescriptionData();

    // InitDatatables(false);

    // // PopulatePatientsStats();
    // // PopulateAppointmentsStats();
    // // PopulatIncomeStats();
    // SubmitTestsData();
    // SubmitTestParametersData();
    // SubmitReportValuesData();

    // SubmitLabReportsData();

    // $("#RoleId").val($("#RolesId option:selected").val());
    // $("#RolesId").change(function () {
    //     var value = $("#RolesId option:selected").val();
    //     var text = $("#RolesId option:selected").text();
    //     $("#RoleId").val(value);
    //     $("#PMDCNo").attr("disabled", text == "Staff");
    // });

    // $("#PatientId").val($("#patients option:selected").val());

    // //$("#UserId").val($("#users option:selected").val());
    // //$("#users").change(function () {
    // //    $("#UserId").val($("#users option:selected").val());
    // //});
    // $("#patients").change(function () {
    //     $("#PatientId").val($("#patients option:selected").val());
    // });

    // $('#form-modal').on('hidden.bs.modal', function (e) {
    //     if ($('#form-modal .modal-title').text() == "RECIEPT")
    //         location.href = "/Reciepts/Index";
    //     else
    //         UpdatePatients();
    // });

    // $("#BloodGroup").val($("#BloodGroups option:selected").text());
    // $("#BloodGroups").change(function () {
    //     /*alert($("#BloodGroups option:selected").text());*/
    //     $("#BloodGroup").val($("#BloodGroups option:selected").text());
    // });

    // $("#errorContainer").hide();
    // if ($("#showform").val() == "0")
    //     $("#createreciept").hide();
    // else {
    //     $("#createreciept").show();
    // }

    // // var dateofbirth = MCDatepicker.create({
    // //     el: "#DateofBirth",
    // //     dateFormat: 'dd/MM/yyyy',
    // //     autoClose: true,
    // //     maxDate: currentDate,
    // //     jumpToMinMax: true,
    // //     closeOnBlur: true,
    // //     showCalendarDisplay: true,
    // //     bodyType: 'inline'
    // // });

    // // dateofbirth.onOpen(function () {
    // //     dateofbirth.setFullDate(SetDate());
    // // });

    // // init_InputMask();
    // initRadioButtons();
    // initPicturePreview();
    // init_calendar();

    // if (location.href.indexOf("/Reciepts/Create") > -1)
    //     UpdateReport();
    // $("#AuthorizedById").change(function () {
    //     AddDiscount();
    // });
    // $("#Discount").change(function () {
    //     AddDiscount();
    // });
    // AddMedication();
    // showInDiv("#addmedication .table tbody", '/Prescriptions/GetSessionMedication');
    // GenderSetup();

    // //SetupMenu();
    // // $('#datetimepicker').datetimepicker({
    // //     format: 'd/m/Y Hi',
    // //     minDate: currentDate,
    // //     mask: true
    // // });

    // // $('#datetimepicker').change(function () {
    // //     var val = $(this).val()
    // //     valArray = val.split(' ');
    // //     $("#ReportDeliveryDate").val(valArray[0]);
    // //     $("#ReportDeliveryTime").val(valArray[1]);
    // // });

    // $(".fmdc-tabs li").on('click', function () {

    //     var id = $(this).data("id");
    //     var li = $(this);
    //     $(li).addClass('active').siblings().removeClass('active');
    //     $(".fmdc-tab-content .active").hide().removeClass('active');
    //     $(id).show().addClass('active');
    //     return false;
    // });
    // $("#PhoneType").change(function () {
    //     var value = $("#PhoneType option:selected").val();
    //     if (value == "1") {
    //         $("#PhoneNo").inputmask('####-#######');
    //     } else {
    //         $("#PhoneNo").inputmask('###-#######');
    //     }

    // });
});


var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');
$TOP_MENU = $('.top_nav');

// Sidebar
function init_sidebar() {
  // TODO: This is some kind of easy fix, maybe we can improve this
  var setContentHeight = function () {
    // reset height
    $RIGHT_COL.css('min-height', $(window).height());

    var bodyHeight = $BODY.outerHeight(),
      footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
      leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
      contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;


    // normalize content
    contentHeight -= $NAV_MENU.height() + footerHeight;

    $RIGHT_COL.css('min-height', contentHeight);
  };

  var openUpMenu = function () {
    $SIDEBAR_MENU.find('li').removeClass('menu-active menu-active-sm');
    $SIDEBAR_MENU.find('li ul').slideUp();
  }

  $SIDEBAR_MENU.find('a').on('click', function (ev) {
    var $li = $(this).parent();

    if ($li.is('.menu-active')) {
      $li.removeClass('menu-active menu-active-sm');
      $('ul:first', $li).slideUp(function () {
        setContentHeight();
      });
    } else {
      // prevent closing menu if we are on child menu
      if (!$li.parent().is('.child_menu')) {
        openUpMenu();
      } else {
        if ($BODY.is('nav-sm')) {
          if (!$li.parent().is('child_menu')) {
            openUpMenu();
          }
        }
      }

      $li.addClass('menu-active');

      $('ul:first', $li).slideDown(function () {
        setContentHeight();
      });
    }
  });

  // toggle small or large menu
  $MENU_TOGGLE.on('click', function () {
    if ($BODY.hasClass('nav-md')) {
      $SIDEBAR_MENU.find('li.menu-active ul').hide();
      $SIDEBAR_MENU.find('li.menu-active')
        .addClass('menu-active-sm')
        .removeClass('menu-active');
    } else {
      $SIDEBAR_MENU.find('li.menu-active-sm ul').show();
      $SIDEBAR_MENU.find('li.menu-active-sm')
        .addClass('menu-active')
        .removeClass('menu-active-sm');
    }

    $BODY.toggleClass('nav-md nav-sm');

    setContentHeight();

    $('.dataTable').each(function () { $(this).dataTable().fnDraw(); });
  });

  // check menu-active menu
  $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

  $SIDEBAR_MENU.find('a').filter(function () {
    return this.href == CURRENT_URL;
  }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
    setContentHeight();
  }).parent().addClass('menu-active');

  // recompute content when resizing
  // $(window).smartresize(function () {
  //   setContentHeight();
  // });

  setContentHeight();

}


function GenderSetup() {
    if ($('#Gender').is(":checked"))
        $("#FemaleMaxMin").slideDown();
    else
        $("#FemaleMaxMin").slideUp();

    $("#Gender").click(function () {
        if ($('#Gender').is(":checked"))
            $("#FemaleMaxMin").slideDown();
        else
            $("#FemaleMaxMin").slideUp();
    });
}

// Utilities Functions Start

function SetDate() {
    var date = $("#DateofBirth").val();
    if (date != "") {
        var milliseconds = moment(date, "dd/MM/yyyy");
        var f = new Date(milliseconds)
        return f;
    }
    else {
        return new Date();
    }
}

function showInPopup(url, title) {
    var temp = url.toLowerCase();

    $.ajax({
        type: 'GET',
        url: url,
        success: function (response) {

            $('#form-modal .modal-body').html(response);
            $('#form-modal .modal-title').text(title);
            $('#form-modal').modal('show');
            if (temp.search("password") > -1) {
                HideAndShowPassword();
            }
            else if (temp.search("addtorole") > -1) {
                SubmitChangeRoleData();
                $("#RoleId").val($("#RolesId option:selected").val());
                $("#RolesId").change(function () {
                    $("#RoleId").val($("#RolesId option:selected").val());
                });
            }
        }
    });
}

function ConfirmDialog(message, handler) {
    $(`<div class="modal fade confirm-modal" id="ConfirmModal" role="dialog">
        <div class= "modal-dialog" role = "document" >
            <div class="modal-content h-100">
                <div class="modal-header">
                    <h5 class="modal-title">${message}</h5>
                </div>
                <div class="modal-footer align-self-center mx-auto">
                    <button type="button" class="btn green" id="btn-yes">Yes</button>
                    <button type="button" class="btn red"  id="btn-no" data-dismiss="modal">No</button>
                </div>
            </div>
        </div>
     </div>`).appendTo('body');


    //Trigger the modal
    $("#ConfirmModal").modal({
        backdrop: 'static',
        keyboard: false
    }).modal("show");

    //Pass true to a callback function
    $("#btn-yes").click(function () {
        handler(true);
        $("#ConfirmModal").modal("hide");
    });

    //Pass false to callback function
    $("#btn-no").click(function () {
        handler(false);
        $("#ConfirmModal").modal("hide");
    });

    //Remove the modal once it is closed.
    $("#ConfirmModal").on('hidden.bs.modal', function () {
        $("#ConfirmModal").remove();
    });
}

function showInDiv(id, url) {

    $.ajax({
        type: 'GET',
        url: url,
        success: function (response) {

            if (typeof response === 'object' && !Array.isArray(response) && response !== null) {

                if (response.success) {
                    $(id).html(response.message);
                }
                else {
                    showToast(response.message, TOAST_STATUS.DANGER);
                }
            } else {
                $(id).html(response);
            }

            $("#errorContainer").hide();

            SubmitProceduresData();
            SubmitProcedureTypesData();
            SubmitMedicationsData();
            SubmitMedicationTypesData();
            SubmitEditTodo();
            GenderSetup();
            SubmitTestParametersData();
            SubmitTestsData();


        }
    });
}

function showToast(message, type) {

    var title = "Notification"
    switch (type) {
        case TOAST_STATUS.SUCCESS:
            title = "Success";
            break;
        case TOAST_STATUS.DANGER:
            title = "Error";
            break;
        case TOAST_STATUS.WARNING:
            title = "Warning";
            break;
        case TOAST_STATUS.INFO:
            title = "Info";
            break;
    }

    //var notification = new PNotify({
    //    title: "FEDERAL MEDICAL AND DIAGNOSTIC CENTER",
    //    text: message,
    //    type: nType,
    //    styling: 'bootstrap3',
    //    addclass: 'dark'
    //});

    // let toast = {
    //     title: title,
    //     message: message,
    //     status: type,
    //     timeout: 5000
    // }
    // Toast.create(toast);

}

function init_InputMask() {

    if (typeof ($.fn.inputmask) === 'undefined') { return; }

    $("#CNIC").inputmask('######-#######-#');
    $("#PhoneNo").inputmask('####-#######');


};

function readURL(input) {

    if (input.files && input.files[0]) {

        var reader = new FileReader();
        reader.onload = function (e) {
            $('#picture').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }

}

function initPicturePreview() {



    $("#filePicture").change(function () {

        readURL(this);

    });
}

function init_calendar() {

    // if (typeof ($.fn.fullCalendar) === 'undefined') { return; }
    // console.log('init_calendar');

    // var date = new Date(),
    //     d = date.getDate(),
    //     m = date.getMonth(),
    //     y = date.getFullYear(),
    //     started,
    //     categoryClass;

    // var calendar = $('#calendar').fullCalendar({
    //     header: {
    //         left: 'prev,next today',
    //         center: 'title',
    //         right: 'month,agendaWeek,agendaDay,listMonth'
    //     },
    //     selectable: true,
    //     selectHelper: true,
    //     select: function (start, end, allDay) {
    //         $('#fc_create').click();

    //         started = start;
    //         ended = end;

    //         $(".antosubmit").on("click", function () {
    //             var title = $("#title").val();
    //             if (end) {
    //                 ended = end;
    //             }

    //             categoryClass = $("#event_type").val();

    //             if (title) {
    //                 calendar.fullCalendar('renderEvent', {
    //                     title: title,
    //                     start: started,
    //                     end: end,
    //                     allDay: allDay
    //                 },
    //                     true // make the event "stick"
    //                 );
    //             }

    //             $('#title').val('');

    //             calendar.fullCalendar('unselect');

    //             $('.antoclose').click();

    //             return false;
    //         });
    //     },
    //     eventClick: function (calEvent, jsEvent, view) {
    //         $('#fc_edit').click();
    //         $('#title2').val(calEvent.title);

    //         categoryClass = $("#event_type").val();

    //         $(".antosubmit2").on("click", function () {
    //             calEvent.title = $("#title2").val();

    //             calendar.fullCalendar('updateEvent', calEvent);
    //             $('.antoclose2').click();
    //         });

    //         calendar.fullCalendar('unselect');
    //     },
    //     editable: true,
    //     events: [{
    //         title: 'All Day Event',
    //         start: new Date(y, m, 1)
    //     }, {
    //         title: 'Long Event',
    //         start: new Date(y, m, d - 5),
    //         end: new Date(y, m, d - 2)
    //     }, {
    //         title: 'Meeting',
    //         start: new Date(y, m, d, 10, 30),
    //         allDay: false
    //     }, {
    //         title: 'Lunch',
    //         start: new Date(y, m, d + 14, 12, 0),
    //         end: new Date(y, m, d, 14, 0),
    //         allDay: false
    //     }, {
    //         title: 'Birthday Party',
    //         start: new Date(y, m, d + 1, 19, 0),
    //         end: new Date(y, m, d + 1, 22, 30),
    //         allDay: false
    //     }, {
    //         title: 'Click for Google',
    //         start: new Date(y, m, 28),
    //         end: new Date(y, m, 29),
    //         url: 'http://google.com/'
    //     }]
    // });

};

function initRadioButtons() {
    $(document).ready(function () {
        $("#Gender").val(0);
        $(".radio-buttons-container .btn-options").click(function () {
            $(this).addClass("btn-selected").siblings().removeClass("btn-selected");
            $("#Gender").val($(this).attr("data-value"));
        });
    });

}

// Utilities Function End

function SetupMenu() {
    $(".menu a").click(function () {
        var li = $(this).data("parent");
        $(li).addClass('active').siblings().removeClass('active');
    });
}

function HideAndShowPassword() {
    $("#errorContainer").hide();
    SubmitChangePassword();
    var eye = "<i class='fa fa-eye'></i>";
    var slasheye = "<i class='fa fa-eye-slash'></i>";

    $("#BtnShowPassword").click(function () {
        var type = $("#password").attr("type");
        if (type === "password") {
            $(this).html(slasheye);
            $("#password").attr("type", "text");
        } else {
            $(this).html(eye);
            $("#password").attr("type", "password");
        }
    });

    $("#BtnShowConfirmPassword").click(function () {
        var type = $("#confirmpassword").attr("type");
        if (type === "password") {
            $(this).html(slasheye);
            $("#confirmpassword").attr("type", "text");
        } else {
            $(this).html(eye);
            $("#confirmpassword").attr("type", "password");
        }
    });



}

function Delete(form) {
    ConfirmDialog('Are you sure to delete this record ?', (ans) => {
        if (ans) {
            try {
                $.ajax({
                    type: 'POST',
                    url: form.action,
                    data: new FormData(form),
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response.success) {
                            showToast(response.message, TOAST_STATUS.SUCCESS);
                            var id = $(form).data("table-id");

                            switch (id) {
                                case "appointments":
                                    UpdateAppointments();
                                    break;
                                case "pendingappointments":
                                    UpdatePendingAppointments();
                                    break;
                                case "patients":
                                    UpdatePatients();
                                    break;
                                case "users":
                                    UpdateUsers();
                                    break;
                                case "reciepts":
                                    UpdateReciepts();
                                    break;
                                case "proceduretypes":
                                    UpdateProcedureTypes();
                                    break;
                                case "procedures":
                                    UpdateProcedures();
                                    break;
                                case "prescriptions":
                                    UpdatePrescriptions();
                                    break;
                                case "tests":
                                    UpdateTests();
                                    break;
                                case "testparameters":
                                    UpdateTestParameters();
                                    break;
                                case "medications":
                                    UpdateMedications();
                                    break;
                                case "medicationtypes":
                                    UpdateMedicationTypes();
                                    break;
                                case "labreports":
                                    UpdateLabReports();
                                    break;
                            }
                            InitDatatables(false);
                        }
                        else {
                            showToast(response.message, TOAST_STATUS.DANGER);
                        }
                    },
                    error: function (err) {
                        console.log(err)
                    }
                });
            } catch (ex) {
                console.log(ex)
            }
        } else {
            console.log("no");
        }
    });
    return false;
}

function AddEndDate(id, type = "p") {

    try {
        $.ajax({
            type: 'POST',
            url: '/Appointments/AddEndDate',
            data: { id: id, type: type },

            success: function (response) {
                if (response.success) {
                    showToast(response.message, TOAST_STATUS.SUCCESS);
                    UpdatePatients();
                    UpdateAppointments();
                }
                else {
                    showToast(response.message, TOAST_STATUS.DANGER);
                }
            },
            error: function (err) {
                console.log(err)
            }
        });
    } catch (ex) {
        console.log(ex)
    }
    return false;
}

function SubmitUsersData() {

    InitProvinceCitySelectList(1, 0);
    var xhr = new XMLHttpRequest();
    $("#errorContainer").hide();

    $("#createusers").validate({
        rules: {

            Name: "required",
            CNIC: {
                required: true,
                remote: {
                    type: "GET",
                    url: "/Users/CheckCNIC",
                    data: {
                        cnic: function () {
                            return $("#CNIC").val();
                        },
                        id: function () {

                            return $("#UserId").val();
                        }
                    }
                },
                pattern: "^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$"

            },
            Username: {
                required: true,
                remote: {
                    type: "GET",
                    url: "/Users/CheckUsername",
                    data: {
                        username: function () {
                            return $("#Username").val();
                        },
                        id: function () {
                            return $("#UserId").val();
                        }
                    }
                },
                pattern: "^(?![^-]*--+)(?![0-9]+$)[a-zA-Z0-9][-a-zA-Z0-9]{3,23}[a-zA-Z0-9]$",
                minlength: 6,
                maxlength: 20
            },
            PMDCNo: {
                required: function () {
                    var isDisabled = $('#PMDCNo').prop('disabled');
                    return isDisabled;
                },
                remote: {
                    depends: function () {
                        var isDisabled = $('#PMDCNo').prop('disabled');
                        return isDisabled;
                    },
                    param: {
                        type: "GET",
                        url: "/Users/CheckPMDCNo",
                        data: {
                            cnic: function () {
                                return $("#PMDCNo").val();
                            },
                            id: function () {
                                return $("#UserId").val();
                            }
                        }
                    }
                }
            },
            DateofBirth: "required",
            PhoneNo: {
                phonePK: true
                //    function () {
                //    var mobilePattern = "^(0)(3)(\d{2})-?(\d{7})$";
                //    var landlinePattern = "^(0)(\d{2}|\d{3}|\d{4})-?(\d{7})$";
                //    var phonetype = $("#PhoneType").val();

                //    var pattern = phonetype == 1 ? mobilePattern : landlinePattern;
                //    $("#debug").val(pattern + " " + phonetype + " " + $("#PhoneNo").val());
                //    return pattern;

                //}
            }
        },
        messages: {
            Name: "Please enter user's Name",
            DateofBirth: "Please enter user's Date of Birth",
            CNIC: {
                required: "Please enter user's CNIC",
                remote: "CNIC already exists",
                pattern: "Please enter a valid CNIC"
            },
            Username: {
                required: "Please enter Username",
                remote: "Username already exists",
                pattern: "Only Alphanumeric chars and hyphen allowed in username",
                minlength: "Username must have atleast 6 chars",
                maxlength: "Username must have maximum 20 chars",
            },
            PMDCNo: {
                required: "Please enter user's PMDC No",
                remote: "PMDC No already exists",
                pattern: "IPlease enter a valid PMDC No"
            },
            PhoneNo: {
                pattern: "Please enter a valid Phone No"
            }

        },
        highlight: function (element, errorClass, validClass) {
            $("#errorContainer").fadeIn();
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        errorElement: 'li',
        errorLabelContainer: '#errorContainer ul',
        submitHandler: function (form) {

            var formdata = new FormData(form);
            var files = $('#filePicture').get(0).files;
            if (files.length > 0) {
                formdata.append("Picture", files[0]);
            }

            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                beforeSend: function () {
                    $("#errorContainer").fadeOut();
                },
                success: function (response) {
                    if (response.success) {
                        ResetUsersForm();

                        showToast(response.message, TOAST_STATUS.SUCCESS);
                    }
                    else {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });
}

function ResetUsersForm() {
    $("#ID").val("");
    $("#Name").val("");
    $("#CNIC").val("");
    $("#PMDCNo").val("");
    $("#DateofBirth").val("");
    $("#CityId").val("");
    $("#provinces").val(1);
    $("#Gender").val("");
    $("#Address").val("");
    $("#errorContainer").hide();
    $("#filePicture").val("");
    $("#picture").attr("src", "/Images/profile.png");
    $(".form-control").removeClass("is-invalid");
    $("#PhoneNo").val("");
    $("#PhoneType").val(1);
    $("#RoleId").val(1);
    $("#Username").val("");
}

function SubmitAppointmentsData() {
    $("#createappointments").validate({
        submitHandler: function (form) {
            var formdata = new FormData(form);

            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                beforeSend: function () {
                    $("#errorContainer").fadeOut();
                },
                success: function (response) {

                    if (response.success) {
                        showToast(response.message, TOAST_STATUS.SUCCESS);
                    } else {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });
}

function ResetAppointmentsForm() {

    $(".form-control").removeClass("is-invalid");
}

function SubmitPatientsData() {
    $("#createpatients").validate({
        rules: {

            Name: "required",
            CNIC: {
                required: true,
                remote: {
                    type: "POST",
                    url: "/Patients/CheckCNIC",
                    data: {
                        cnic: function () {
                            return $("#CNIC").val();
                        },
                        id: function () {
                            return $("#ID").val();
                        }
                    }
                },
                pattern: "^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$"

            },
            DateofBirth: "required",
        },
        messages: {
            Name: "Please enter patient's Name",
            DateofBirth: "Please enter patient's Date of Birth",
            CNIC: {
                required: "Please enter patient's CNIC",
                remote: "CNIC already exists",
                pattern: "Invalid CNIC"
            }
        },
        highlight: function (element, errorClass, validClass) {
            $("#errorContainer").fadeIn();
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        errorElement: 'li',
        errorLabelContainer: '#errorContainer ul',
        submitHandler: function (form) {
            var formdata = new FormData(form);
            var files = $('#filePicture').get(0).files;
            if (files.length > 0) {
                formdata.append("Picture", files[0]);
            }

            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                beforeSend: function () {
                    $("#errorContainer").fadeOut();
                },
                success: function (response) {
                    if (response.success) {
                        ResetPatientsForm();
                        showToast(response.message, TOAST_STATUS.SUCCESS);
                        //$("#CreateAppointment").show();
                    } else {
                        showToast(response.message, TOAST_STATUS.DANGER);

                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });
}

function ResetPatientsForm() {

    $("#Name").val("");
    $("#CNIC").val("");
    $("#DateofBirth").val("");
    $("#CityId").val("");
    $("#provinces").val(1);
    $("#Gender").val("");
    $("#Address").val("");
    $("#FatherName").val("");
    $("#PhoneNo").val("");
    $("#picture").attr("src", "/Images/profile.png");
    $("#filePicture").val("");
    $("#errorContainer").hide();

    $(".form-control").removeClass("is-invalid");


}

function SubmitProcedureTypesData() {
    $("#createproceduretypes").validate({
        rules: {
            Name: {
                required: true,
                maxlength: 500
            }
        },
        messages: {
            Name: {
                required: "Procedure Type Name is required",
                maxlength: "Procedure Type name cannot exceed 500 chars"
            }
        },
        highlight: function (element, errorClass, validClass) {
            $("#errorContainer").fadeIn();
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        errorElement: 'li',
        errorLabelContainer: '#errorContainer ul',
        submitHandler: function (form) {

            var formdata = new FormData(form);

            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                beforeSend: function () {
                    $("#errorContainer").fadeOut();
                },
                success: function (response) {
                    if (response.success) {
                        showToast(response.message, TOAST_STATUS.SUCCESS);
                        ResetProcedureTypesForm();
                    } else {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });
}

function ResetProcedureTypesForm() {

    $("#Name").val("");
    showInDiv('#ProcedureTypesForm', '/ProcedureTypes/Create');
    $("#errorContainer").hide();

    $(".form-control").removeClass("is-invalid");
    UpdateProcedureTypes();

}

function SubmitProceduresData() {

    var xhr = new XMLHttpRequest();

    $("#createprocedures").validate({
        rules: {
            Name: {
                required: true,
                maxlength: 500
            }, Cost: "required"
        },
        messages: {
            Name: {
                required: "Procedure Name is required",
                maxlength: "Procedure Name cannot exceed 500 chars"
            },
            Cost: "Procedure Cost is required"
        },
        highlight: function (element, errorClass, validClass) {
            $("#errorContainer").fadeIn();
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        errorElement: 'li',
        errorLabelContainer: '#errorContainer ul',
        submitHandler: function (form) {


            var formdata = new FormData(form);

            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                success: function (response) {

                    if (response.success) {
                        ResetProceduresForm();
                        showToast(response.message, TOAST_STATUS.SUCCESS);

                    } else {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });

}

function ResetProceduresForm() {

    $("#Name").val("");
    $("#Cost").val("");
    $("#errorContainer").hide();

    showInDiv('#ProcedureForm', '/Procedures/Create');
    $(".form-control").removeClass("is-invalid");
    UpdateProcedures();
}

function SubmitRecieptData() {

    $("#createreciept").validate({
        rules: {
            ProcedureCount: {
                greaterThanZero: true
            }
        },
        messages: {
            ProcedureCount: {
                greaterThanZero: "Procedure Count cannot be zero"
            }

        },
        highlight: function (element, errorClass, validClass) {
            $("#errorContainer").fadeIn();
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        errorElement: 'li',
        errorLabelContainer: '#errorContainer ul',
        submitHandler: function (form) {

            var formdata = new FormData(form);

            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                beforeSend: function () {
                    $("#errorContainer").fadeOut();
                },
                success: function (response) {
                    if (response.success) {

                        showToast(response.message, TOAST_STATUS.SUCCESS);
                        showInPopup(response.reciepturl, response.title);
                    }
                    else { showToast(response.message, TOAST_STATUS.DANGER); }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });

}

function SubmitCreateTodo() {
    //$("#Title").tooltip("dispose");

    $("#createTodo").validate({
        rules: {
            Title: {
                required: true,
                maxlength: 250
            }
        },
        messages: {
            Title: {
                required: "Title is required",
                maxlength: "Title cannont exceed 250 chars"

            }
        },
        showErrors: function (errorMap, errorList) {
            // Clean up any tooltips for valid elements
            $.each(this.validElements(), function (index, element) {
                var $element = $(element);
                $element
                    .removeClass("is-invalid").attr("placeholder", $element.attr("id"));

            });
            // Create new tooltips for invalid elements
            $.each(errorList, function (index, error) {
                var $element = $(error.element);

                $element
                    .addClass("is-invalid").attr("placeholder", error.message);


            });
        },

        submitHandler: function (form) {
            var formdata = new FormData(form);

            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                success: function (response) {
                    if (response.success) {
                        showToast(response.message, TOAST_STATUS.SUCCESS);
                        $("#createTodo #Title").val("");
                        UpdateTodo();

                    }
                    else {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });
}

function SubmitEditTodo() {
    //$("#Title").tooltip("dispose");

    $("#editTodo").validate({
        rules: {
            Title: {
                required: true,
                maxlength: 250
            }
        },
        messages: {
            Title: {
                required: "Title is required",
                maxlength: "Title cannont exceed 250 chars"

            }
        },
        showErrors: function (errorMap, errorList) {
            // Clean up any tooltips for valid elements
            $.each(this.validElements(), function (index, element) {
                var $element = $(element);
                $element
                    .removeClass("is-invalid").attr("placeholder", $element.attr("id"));

            });
            // edit new tooltips for invalid elements
            $.each(errorList, function (index, error) {
                var $element = $(error.element);

                $element
                    .addClass("is-invalid").attr("placeholder", error.message);


            });
        },

        submitHandler: function (form) {
            var formdata = new FormData(form);

            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                success: function (response) {
                    if (response.success) {
                        showToast(response.message, TOAST_STATUS.SUCCESS);
                        $("#editTodo #Title").val("");
                        UpdateTodo();

                    }
                    else {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });
}

function SubmitChangePassword() {
    $("#ChangePasswordForm").validate({
        rules: {
            password: {
                required: true,
                maxlength: 16,
                minlength: 8,
                //complexity: true

            },
            confirmpassword: {
                required: true,
                equalTo: '#password'
            }

        },

        messages: {
            password: {
                required: "Password is required",
                maxlength: "Password cannot be longer than 16 characters",
                minlength: "Password should be minimum 8 characters long",
                //complexity: "Password must contain one capital letter, one numerical and one special character"

            },
            confirmpassword: {
                required: "Confirm Password is required",
                equalTo: 'Password do not match'
            }
        },
        highlight: function (element, errorClass, validClass) {
            var numItems = $('.is-invalid').length
            if (numItems == 0)
                $("#errorContainer").fadeOut();
            else
                $("#errorContainer").fadeIn();
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            var numItems = $('.is-invalid').length
            if (numItems == 0)
                $("#errorContainer").fadeOut();

            $(element).removeClass('is-invalid');
        },
        errorElement: 'li',
        errorLabelContainer: '#errorContainer ul',
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                beforeSend: function () {
                    $("#errorContainer").fadeOut();
                },
                success: function (response) {

                    if (response.success) {
                        $("#form-modal").modal('hide');
                        ResetPasswordForm();
                        showToast(response.message, TOAST_STATUS.SUCCESS);
                    }
                    else {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });
}

function ResetPasswordForm() {
    $("#password").val("");
    $("#confirmpassword").val("");
    $("#errorContainer").fadeOut();
}

function SubmitChangeRoleData() {
    $("#AddToRole").validate({
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                beforeSend: function () {
                    $("#errorContainer").fadeOut();
                },
                success: function (response) {

                    if (response.success) {
                        $('#form-modal').modal('hide');
                        UpdateUsers();
                        showToast(response.message, TOAST_STATUS.SUCCESS);
                    } else {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });
}

function GetCities(provinceid, cityId = -1) {
    var $child = $('#cities');
    $.ajax({
        url: "/Patients/GetCities",
        data: { provinceid: provinceid },
        dataType: "json",
        type: "GET",
        success: function (data) {
            $child.find("option").remove();
            //alert(JSON.stringify(data));
            $.each(data, function (i, data) {      // bind the dropdown list using json result
                $('<option value="' + data.CityId + '">' + data.Name + '</option>').appendTo("#cities");
            });

            $child.removeAttr('disabled');
            if (cityId > 0)
                $("#cities").val(cityId);

            var i = $('#cities option:selected').val();
            $("#CityId").val(i);
        }
    });

}

function InitProvinceCitySelectList(pid, cid) {



    var $parent = $('#provinces');

    var $child = $('#cities');

    if ($parent.length && $child.length) {

        $child.attr('disabled', 'true');
        $child.find("option").remove();
        /*var value = $('#provinces').val();*/
        var i = pid;//$('#provinces').val();
        $parent.val(pid);
        if (i > -1) {
            GetCities(i, cid);

        }
    }
    $parent.change(function () {
        var i = $('#provinces option:selected').val();
        if (i > -1) {
            GetCities(i);

        }

    });
    $child.change(function () {

        var i = $('#cities option:selected').val();
        $("#CityId").val(i);
    });



}

function SubmitMedicationTypesData() {
    $("#createmedicationtypes").validate({
        rules: {
            Name: {
                required: true,
                maxlength: 500

            }
        },
        messages: {
            Name: {
                required: "Medication Type Name is required",
                maxlength: "Medication Type name cannont exceed 500 chars"

            }
        },
        highlight: function (element, errorClass, validClass) {
            $("#errorContainer").fadeIn();
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        errorElement: 'li',
        errorLabelContainer: '#errorContainer ul',
        submitHandler: function (form) {

            var formdata = new FormData(form);

            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                beforeSend: function () {
                    $("#errorContainer").fadeOut();
                },
                success: function (response) {
                    if (response.success) {
                        showToast(response.message, TOAST_STATUS.SUCCESS);
                        ResetMedicationTypesForm();


                    } else {
                        showToast(response.message, TOAST_STATUS.DANGER);

                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });
}

function ResetMedicationTypesForm() {

    $("#Name").val("");
    showInDiv('#MedicationTypesForm', '/MedicationTypes/Create');
    $("#errorContainer").hide();

    $(".form-control").removeClass("is-invalid");
    UpdateMedicationTypes();

}

function SubmitMedicationsData() {

    var xhr = new XMLHttpRequest();

    $("#createmedications").validate({
        rules: {

            Name: {
                required: true,
                maxlength: 1000
            },
            Brand: {
                required: true,
                maxlength: 1000
            }
        },
        messages: {
            Name: {
                required: "Medication Name is required",
                maxlength: "Medication Name cannot exceed 1000 chars"
            },
            Brand: {
                required: "Medication Brand is required",
                maxlength: "Medication Brand cannot exceed 1000 chars"
            }
        },
        highlight: function (element, errorClass, validClass) {
            $("#errorContainer").fadeIn();
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        errorElement: 'li',
        errorLabelContainer: '#errorContainer ul',
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                success: function (response) {
                    if (response.success) {
                        ResetMedicationsForm();
                        showToast(response.message, TOAST_STATUS.SUCCESS);

                    } else {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });

}

function ResetMedicationsForm() {

    $("#Name").val("");
    $("#Brand").val("");
    $("#Description").val("");
    $("#errorContainer").hide();

    showInDiv('#MedicationForm', '/Medications/Create');
    $(".form-control").removeClass("is-invalid");
    UpdateMedications();
}

function SubmitMedicationsData() {

    var xhr = new XMLHttpRequest();

    $("#createmedications").validate({
        rules: {
            DeliveryDate: "required",
            DeliveryTime: "required"
        },
        messages: {
            DeliveryDate: "Delivery Date is required",
            DeliveryTime: "Delivery Time is required"
        },
        highlight: function (element, errorClass, validClass) {
            $("#errorContainer").fadeIn();
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        errorElement: 'li',
        errorLabelContainer: '#errorContainer ul',
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                success: function (response) {
                    if (response.success) {
                        ResetMedicationsForm();
                        showToast(response.message, TOAST_STATUS.SUCCESS);

                    } else {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });

}

function ResetMedicationsForm() {

    $("#Name").val("");
    $("#Brand").val("");
    $("#Description").val("");
    $("#errorContainer").hide();

    showInDiv('#MedicationForm', '/Medications/Create');
    $(".form-control").removeClass("is-invalid");
    UpdateMedications();
}

var groupColumn = 6;
var domValue = 'Bfrtip';

function GetOptions(id) {

    var NoOrderCols = [0];
    var SearchableCols = [1];
    var ExportCols = [1, ":visible"];
    var InitialOrderCol = 1;
    var callback = id;

    switch (id) {
        case "appointments":
            NoOrderCols = [5];
            SearchableCols = [1, 2, 3, 4];
            ExportCols = [1, 2, 3, 4, ":visible"];
            InitialOrderCol = 2;
            //callback = "appointments";
            break;
        case "pendingappointments":
            NoOrderCols = [5];
            SearchableCols = [1, 2, 3, 4];
            ExportCols = [1, 2, 3, 4, ":visible"];
            InitialOrderCol = 0;
            //callback = "pendingappointments";
            break;
        case "patients":
            NoOrderCols = [0, 7, 8];
            SearchableCols = [1, 2, 3, 4, 5, 6];
            ExportCols = [1, 2, 3, 4, 5, 6, ":visible"];
            InitialOrderCol = 3;
            //callback = "patients";

            break;
        case "users":
            NoOrderCols = [0, 2, 10, 11];
            SearchableCols = [1, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14];
            ExportCols = [1, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, ":visible"];
            InitialOrderCol = 6;
            //callback = "users";
            break;
        case "reciepts":
            NoOrderCols = [7, 8];
            SearchableCols = [1, 2, 3, 4, 5, 6];
            ExportCols = [1, 2, 3, 4, 5, 6, ":visible"];
            InitialOrderCol = 7;
            //callback = "reciepts";
            break;
        case "proceduretypes":
            NoOrderCols = [1];
            SearchableCols = [0];
            ExportCols = [0, ":visible"];
            InitialOrderCol = 0;
            //callback = "proceduretypes";
            break;
        case "procedures":
            NoOrderCols = [3];
            SearchableCols = [0, 1, 2];
            ExportCols = [0, 1, 2, ":visible"];
            InitialOrderCol = 2;
            //callback = "procedures";
            break;
        case "prescriptions":
            NoOrderCols = [3];
            SearchableCols = [0, 1, 2];
            ExportCols = [0, 1, 2, ":visible"];
            InitialOrderCol = 0;
            //callback = "prescriptions";
            break;
        case "tests":
            NoOrderCols = [2];
            SearchableCols = [0, 1];
            ExportCols = [0, 1, ":visible"];
            InitialOrderCol = 0;
            //callback = "tests";
            break;
        case "testsparameters":
            NoOrderCols = [5];
            SearchableCols = [0, 1, 2, 3, 4];
            ExportCols = [0, 1, 2, 3, 4, ":visible"];
            InitialOrderCol = 0;
            //callback = "testparameters";
            break;
        case "medications":
            NoOrderCols = [3];
            SearchableCols = [0, 1, 2];
            ExportCols = [0, 1, 2, ":visible"];
            InitialOrderCol = 0;
            //callback = "medications";
            break;
        case "medicationtypes":
            NoOrderCols = [1];
            SearchableCols = [0];
            ExportCols = [0, ":visible"];
            InitialOrderCol = 0;
            //callback = "medicationtypes";
            break;
        case "labreports":
            NoOrderCols = [7];
            SearchableCols = [0, 1, 2, 3, 4, 5, 6];
            ExportCols = [0, 1, 2, 3, 4, 5, 6, ":visible"];
            InitialOrderCol = 0;
            //callback = "labreports";
            break;
        case "pda":
            SearchableCols = [0, 1, 2, 3];
            ExportCols = [0, 1, 2, 3, ":visible"];
            InitialOrderCol = 0;
            break;
        case "pdr":
            SearchableCols = [0, 1, 2, 3, 4];
            ExportCols = [0, 1, 2, 3, , 4, ":visible"];
            InitialOrderCol = 0;
            break;
    }

    var options = {
        "lengthMenu": [[10, 25, 50, -1], ["Show 10 Rows", "Show 25 Rows", "Show 50 Rows", "Show All Rows"]],
        keys: true,
        fixedHeader: true,
        responsive: true,
        select: false,
        columnDefs: [
            { orderable: false, targets: NoOrderCols }
        ],
        "order": [[InitialOrderCol, "desc"]],
        language: {
            searchBuilder: {
                button: '<i class="fa fa-search"></i>',
            }
        },
        dom: domValue,
        buttons: [

            {
                extend: 'pageLength'
            },
            {
                extend: 'searchBuilder',
                config: {
                    columns: SearchableCols
                }
            },
            {
                extend: 'collection',
                text: '<i class="fa fa-cog"></i>',
                buttons: ['csv', 'excel', 'pdf']
            },
            {
                extend: 'print',
                text: '<i class="fa fa-print"></i>',
                exportOptions: {
                    columns: ExportCols
                }
            }, {
                extend: 'colvis',
                text: '<i class="fa fa-columns"></i>',

            },

            {
                text: '<i class="fa fa-refresh"></i>',
                action: function (e, dt, node, config) {
                    switch (callback) {
                        case "appointments":
                            UpdateAppointments();
                            break;
                        case "pendingappointments":
                            UpdatePendingAppointments();
                            break;
                        case "patients":
                            UpdatePatients();
                            break;
                        case "users":
                            UpdateUsers();
                            break;
                        case "reciepts":
                            UpdateReciepts();
                            break;
                        case "proceduretypes":
                            UpdateProcedureTypes();
                            break;
                        case "procedures":
                            UpdateProcedures();
                            break;
                        case "prescriptions":
                            UpdatePrescriptions();
                            break;
                        case "tests":
                            UpdateTests();
                            break;
                        case "testparameters":
                            UpdateTestParameters();
                            break;
                        case "medications":
                            UpdateMedications();
                            break;
                        case "medicationtypes":
                            UpdateMedicationTypes();
                            break;
                        case "labreports":
                            UpdateLabReports();
                            break;
                    }
                }
            },
        ],
        destroy: true,
        //statesave: false,

    };

    return options;
}

function InitDatatables(options) {

    // if (true) {
    //     $(".adatatable").DataTable(GetOptions("appointments"));
    //     $(".pdatatable").DataTable(GetOptions("procedures"));
    //     $(".udatatable").DataTable(GetOptions("users"));
    //     $(".patdatatable").DataTable(GetOptions("patients"));
    //     $(".ptdatatable").DataTable(GetOptions("proceduretypes"));
    //     $(".rdatatable").DataTable(GetOptions("reciepts"));
    //     $(".mdatatable").DataTable(GetOptions("medicines"));
    //     $(".mtdatatable").DataTable(GetOptions("medicinetypes"));
    //     $(".tdatatable").DataTable(GetOptions("tests"));
    //     $(".tpdatatable").DataTable(GetOptions("testsparameters"));
    //     $(".lrdatatable").DataTable(GetOptions("labreports"));

    //     $(".pdadatatable, .pdpdatatable").DataTable(GetOptions("pda"));
    //     $(".pdlrdatatable, .pdrdatatable").DataTable(GetOptions("pdr"));

    // }
    // else {
    //     $(".adatatable").DataTable();
    //     $(".pdatatable").DataTable();
    //     $(".udatatable").DataTable();
    //     $(".patdatatable").DataTable();
    //     $(".ptdatatable").DataTable();
    //     $(".mdatatable").DataTable();
    //     $(".mtdatatable").DataTable();
    //     $(".tdatatable").DataTable();
    //     $(".tpdatatable").DataTable();
    //     $(".lrdatatable").DataTable();
    // }
}

function UpdatePatients() {
    $.ajax({
        type: 'GET',
        url: '/Patients/GetViewAll',
        success: function (response) {

            $('#PatientsDataTable').html(response.message);
            //$(".patdatatable").DataTable();
            InitDatatables(true);
        }
    });
}

function UpdateProcedureTypes() {
    $.ajax({
        type: 'GET',
        url: '/ProcedureTypes/GetViewAll',
        success: function (response) {

            $('#ProcedureTypesDataTable').html(response.message);
            //$(".ptdatatable").DataTable();
            InitDatatables(true);
        }
    });
}

function UpdateProcedures() {
    $.ajax({
        action: 'GET',
        url: '/Procedures/GetViewAll',
        success: function (response) {

            $('#ProceduresDataTable').html(response.message);
            //$(".ptdatatable").DataTable();
            InitDatatables(true);
        }
    });
}

function UpdatePrescriptions() {
    $.ajax({
        action: 'GET',
        url: '/Prescriptions/GetViewAll',
        success: function (response) {

            $('#PrescriptionsDataTable').html(response.message);
            //$(".ptdatatable").DataTable();
            InitDatatables(true);
        }
    });
}

function UpdateMedicationTypes() {
    $.ajax({
        type: 'GET',
        url: '/MedicationTypes/GetViewAll',
        success: function (response) {

            $('#MedicationTypesDataTable').html(response.message);
            //$(".ptdatatable").DataTable();
            InitDatatables(true);
        }
    });
}

function UpdateMedications() {
    $.ajax({
        action: 'GET',
        url: '/Medications/GetViewAll',
        success: function (response) {

            $('#MedicationsDataTable').html(response.message);
            //$(".ptdatatable").DataTable();
            InitDatatables(true);
        }
    });
}

function UpdateReciepts() {


    $.ajax({
        action: 'GET',
        url: '/Reciepts/GetViewAll',
        success: function (response) {

            $('#RecieptsDataTable').html(response.message);
            //$(".ptdatatable").DataTable();
            InitDatatables(true);
        }
    });


}

function UpdateReport() {
    showInDiv("#ReportContainer", '/Reciepts/Reciept');
}

function UpdateAppointments() {

    let url = "/Appointments/GetViewAll";

    $.ajax({
        type: 'GET',
        url: url,
        success: function (response) {

            if (typeof response === 'object' && !Array.isArray(response) && response !== null) {

                if (response.success) {
                    $('#Appointments').html(response.message);
                }
                else {
                    showToast(response.message, TOAST_STATUS.DANGER);
                }
            } else {
                $('#Appointments').html(response);
            }
            InitDatatables(true);
        }
    });


}

function UpdatePendingAppointments() {

    let url = "/Appointments/GetPending";
    $.ajax({
        type: 'GET',
        url: url,
        success: function (response) {
            $('#PendingAppointments').html(response);
            InitDatatables(true);
        }
    });
}

function UpdateLabReports() {
    $.ajax({
        action: 'GET',
        url: '/LabReports/GetViewAll',
        success: function (response) {
            $('#LabReportsDataTable').html(response.message);
            InitDatatables(true);
        }
    });
}

function AddProcedure() {
    var id = $("#Reciept-ProcedureId option:selected").val()
    $.ajax({
        type: 'GET',
        url: '/Reciepts/AddProcedure',
        data: { id: id },
        success: function (response) {
            if (response.success) {
                //$('#reciept-table tbody').append(CreateRow(response.name, response.cost));
                showToast(response.message, TOAST_STATUS.SUCCESS);
                $("#createreciept").show();
                UpdateReport();
            }
            else
                showToast(response.message, TOAST_STATUS.DANGER);
        }
    });
}

function AddDiscount() {
    var discount = $("#Discount").val();
    var authby = $("#AuthorizedById option:selected").val();

    $.ajax({
        type: 'GET',
        url: '/Reciepts/AddDiscount',
        data: { Discount: discount, AuthorizedById: authby },
        success: function (response) {
            if (response.success) {
                UpdateReport();
                showToast(response.message, TOAST_STATUS.SUCCESS);
            }
            else
                showToast(response.message, TOAST_STATUS.DANGER);
        }
    });
}



function UpdateEdit(link, id) {
    var li = $(link).closest("li");
    var url = "/TodoEvents/Edit?id=" + id;
    $(li).removeClass("todo-strikeout");
    //alert(url);
    if (id > 0) {
        showInDiv(li, url);
        SubmitCreateTodo();
    }
}

function UpdateTodo() {
    $.ajax({
        type: 'GET',
        url: '/TodoEvents/Index',
        success: function (response) {
            $('.todo').html(response.message);
        }
    });
}

function UpdateTodoStatus(id) {

    $.ajax({
        type: 'POST',
        url: '/TodoEvents/DeleteOrUpdateStatus',
        data: {
            id: id,
            Type: 'status'
        },
        success: function (response) {
            if (response.success) {
                showToast(response.message, TOAST_STATUS.SUCCESS);
                UpdateTodo();
            }
        },
        error: function (response) {
            showToast(response.message, TOAST_STATUS.DANGER);
        }
    });

}

function DeleteTodo(form) {
    ConfirmDialog('Are you sure?', (ans) => {
        if (ans) {
            try {
                $.ajax({
                    type: 'POST',
                    url: form.action,
                    data: new FormData(form),
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response.success) {
                            showToast(response.message, TOAST_STATUS.SUCCESS);
                            UpdateTodo();
                        }
                    },
                    error: function (response) {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                });
            } catch (ex) {
                showToast(ex, TOAST_STATUS.DANGER);
            }
        } else {
            console.log("no");
        }
    });
    return false;
}

function UpdatePaidStatus(id, modal = false) {
    try {
        $.ajax({
            type: 'POST',
            url: '/Reciepts/UpdatePaidStatus',
            data: { id: id },
            success: function (response) {
                if (response.success) {
                    showToast(response.message, TOAST_STATUS.SUCCESS);
                    if (modal) {
                        showInDiv("#form-modal .modal-body", '/Reciepts/GenerateReciept/' + id);
                    }
                    $("").modal('hide');
                    UpdateReciepts();
                }
            },
            failure: function (response) {
                showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
            },
            error: function (response) {
                showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
            }
        });
    } catch (ex) {
        showToast(ex, TOAST_STATUS.DANGER);
    }

    return false;
}

function ManageUser(type, id) {

    var url = "";
    var submit = true;

    switch (type) {
        case "removerole":
            url = '/Users/RemoveFromRole';
            break;
        case "addrole":
            submit = false;
            showInPopup('/Users/AddToRole?id=' + id, 'Change Role');
            break;
        case "actdeactuser":
            url = '/Users/ToggleUserStatus';
            break;
        case "resetpwd":
            url = '/Users/ResetPassword';
            break;
        default:
            return;
    }



    if (submit) {
        $.ajax({
            type: "POST",
            url: url,

            data: { id: id },
            headers: {
                RequestVerificationToken:
                    $('input:hidden[name="__RequestVerificationToken"]').val()
            },
            success: function (response) {
                if (response.success) {
                    showToast(response.message, TOAST_STATUS.SUCCESS);
                    UpdateUsers();
                }
                else {
                    showToast(response.message, TOAST_STATUS.DANGER);
                }
            },
            failure: function (response) {
                showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
            },
            error: function (response) {
                showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
            }
        });
    }

}

function UpdateUsers() {

    $.ajax({
        type: 'GET',
        url: '/Users/GetViewAll',
        success: function (response) {
            $('[data-toggle="tooltip"]').tooltip('hide');
            $('#UsersDataTable').html(response.message);
            //$(".udatatable").DataTable();
            InitDatatables(true);
        }
    });
}

function ShowRecieptProcedures(id) {

    let url = "/Reciepts/GetRecieptProcedures?id=" + id;
    showInDiv("#ProceduresDataTable", url);

}

function PopulatePatientsStats() {
    $.ajax({
        type: 'GET',
        url: '/Patients/GetPatientsStat',

        success: function (response) {
            if (response.success) {

                //$("#PatientsSummary .count").html(response.patients);
                //$("#PatientsSummary p").html("Males: <i class=\"green\">" + response.males + "</i> Females: <i class=\"green\">" + response.females + "</i>Others <i class=\"green\">" + response.others +"</i>");

                $("#totalpatients .count").html(response.patients)
                $("#malepatients .count").html(response.males)
                $("#femalepatients .count").html(response.females)
                $("#otherpatients .count").html(response.others)
            }
        }
    });
}

function PopulateAppointmentsStats() {
    $.ajax({
        type: 'GET',
        url: '/Appointments/GetAppointmentStats',

        success: function (response) {
            if (response.success) {

                $("#ttotalappnts .count").html(response.todaystotal);
                $("#tpendingappnts .count").html(response.todayspending);
                $("#totalappnts .count").html(response.total);
                $("#pendingappnts .count").html(response.pending);


            }
        }
    });
}

function PopulatIncomeStats() {
    $.ajax({
        type: 'GET',
        url: '/Reciepts/GetIncomeStat',
        success: function (response) {
            if (response.success) {
                $("#todayincome .income-count").html("<span class='count green-text'>" + response.todays + "</span> Rs.");
                $("#totalincome .income-count").html("<span class='count red-text'>" + response.total + "</span> Rs.");
            }
        }
    });
}

function ToggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

function init_charts() {

    // console.log('run_charts  typeof [' + typeof (Chart) + ']');

    // if (typeof (Chart) === 'undefined') { return; }

    // console.log('init_charts');


    // Chart.defaults.global.legend = {
    //     enabled: false
    // };

    // if ($('#canvas_line1').length) {
    //     var chart = document.getElementById("canvas_line1");
    //     var myChart = new Chart(chart, {
    //         type: 'line',
    //         data: {
    //             labels: [],
    //             datasets: [
    //                 {
    //                     label: "My First dataset",
    //                     backgroundColor: "rgba(40, 112, 168, 0.31)",
    //                     borderColor: "rgba(40, 112, 168, 0.7)",
    //                     pointBorderColor: "rgba(40, 112, 168, 0.7)",
    //                     pointBackgroundColor: "rgba(40, 112, 168, 0.7)",
    //                     pointHoverBackgroundColor: "#fff",
    //                     pointHoverBorderColor: "rgba(220,220,220,1)",
    //                     pointBorderWidth: 1,
    //                     data: [],
    //                     spanGaps: true,
    //                     autoPadding: true,
    //                 }
    //             ]
    //         },
    //         options: {
    //             tooltips: {
    //                 mode: 'index',
    //                 intersect: false
    //             },
    //             scales: {
    //                 yAxes: [{
    //                     ticks: {
    //                         beginAtZero: true
    //                     }
    //                 }]
    //             }
    //         }
    //     });
    //     ajax_chart(myChart, '/Reciepts/GetIncomeChartData');

    // }
}

function ajax_chart(chart, url, data) {
    var data = data || {};

    $.getJSON(url, data).done(function (response) {
        if (response.success) {
            chart.data.labels = response.labels;
            chart.data.datasets[0].data = response.amount; // or you can iterate for multiple datasets
            chart.update(); // finally update our chart
        }
    });
}

function AddMedication() {


    $("#addmedication").validate({
        rules: {
            Quantity: {
                required: true,
                greaterThanZero: true
            },
            Times: {
                required: true,
                greaterThanZero: true
            }
        },
        messages: {
            Quantity: {
                required: "Quantity is required",
                greaterThanZero: "Quantity should be greater than zero"
            },
            Times: {
                required: "No of Times / day is required",
                greaterThanZero: "No of Times / day should be greater than zero"

            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');

        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        showErrors: function (errorMap, errorList) {

            $.each(errorList, function (index, error) {
                showToast(error.message, TOAST_STATUS.DANGER);
            });

        },
        submitHandler: function (form) {
            //var quantity = $("#Quantity").val();
            //var times = $("#Times").val();
            //var medicine = $("#Code option:selected").text();
            //var unit = $("#Units option:selected").text();
            //var nomedicineRows = $(".table tbody tr.no-medicine").length;

            //var button = "<button type='button' class='btn red' onclick='DeleteRow()'><i class='fa fa-times'></a></button>";
            //var row = "<tr><td>" + medicine + "</td><td>" + quantity + "</td><td>" + unit + "</td><td>" + times + "</td><td>" + button + "</td></tr> ";

            //if (nomedicineRows == 1) {
            //    $(".table tbody").html(row);
            //    $("#Quantity").val("0");
            //    $("#Times").val("0");
            //}
            //else {
            //    $("#Quantity").val("0");
            //    $("#Times").val("0");
            //    $(".table tbody").append(row);
            //}

            var quantity = $("#Quantity").val();
            var times = $("#Times").val();
            var medicine = $("#Code option:selected").val();
            var unit = $("#Units option:selected").text();
            var id = $("#ID").val();

            $.ajax({
                type: "POST",
                url: '/Prescriptions/AddPrescriptionMediction',
                //contentType: false,
                //processData: false,
                data: {
                    Quantity: quantity,
                    Times: times,
                    Units: unit,
                    Code: medicine
                },
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                success: function (response) {
                    if (response.success) {
                        $("#Quantity").val("0");
                        $("#Times").val("0");
                        showToast(response.message, TOAST_STATUS.SUCCESS);
                        showInDiv("#addmedication .table tbody", '/Prescriptions/GetSessionMedication');
                    } else {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });
        }
    });
}

function SubmitPrescriptionData() {

    $("#createprescription").submit(function () {

        $.ajax({
            type: "POST",
            url: '/Prescriptions/Create',
            headers: {
                RequestVerificationToken:
                    $('input:hidden[name="__RequestVerificationToken"]').val()
            },
            success: function (response) {
                if (response.success) {
                    $("#Quantity").val("0");
                    $("#Times").val("0");
                    showToast(response.message, TOAST_STATUS.SUCCESS);
                    UpdateReport();
                } else {
                    showToast(response.message, TOAST_STATUS.DANGER);
                }
            },
            failure: function (response) {
                showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
            },
            error: function (response) {
                showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
            }
        });

        return false;
    });
}

function RemoveMedication(id) {

    $.ajax({
        type: "POST",
        url: '/Prescriptions/RemoveMedicine',
        data: { id: id },
        headers: {
            RequestVerificationToken:
                $('input:hidden[name="__RequestVerificationToken"]').val()
        },
        success: function (response) {
            if (response.success) {
                $("#Quantity").val("0");
                $("#Times").val("0");
                showToast(response.message, TOAST_STATUS.SUCCESS);
                showInDiv("#addmedication .table tbody", '/Prescriptions/GetSessionMedication');

            } else {
                showToast(response.message, TOAST_STATUS.DANGER);
            }
        },
        failure: function (response) {
            showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
        },
        error: function (response) {
            showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
        }
    });
    return false;

}

function UpdatePatientsDetails(id) {
    showInDiv("#patientsprescriptions", "/Prescriptions/GetViewAll/" + id);
    showInDiv("#patientsappointments", "/Appointments/GetViewAll/" + id);
    showInDiv("#patientsreciepts", "/Reciepts/GetViewAll/" + id);
    showInDiv("#patientsreports", "/LabReports/GetViewAll/" + id);
}

function SubmitTestsData() {
    $("#createtests").validate({
        rules: {

            Name: {
                required: true,
                maxlength: 500
            },
            Description: {

                maxlength: 1000
            }
        },
        messages: {
            Name: {
                required: "Test Name is required",
                maxlength: "Test Name cannot exceed 500 chars"
            },
            Description: {

                maxlength: "Description cannot exceed 1000 chars"
            }
        },
        highlight: function (element, errorClass, validClass) {
            $("#errorContainer").fadeIn();
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        errorElement: 'li',
        errorLabelContainer: '#errorContainer ul',
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                success: function (response) {
                    if (response.success) {
                        ResetTestsForm();
                        showToast(response.message, TOAST_STATUS.SUCCESS);

                    } else {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });

}

function ResetTestsForm() {

    $("#Name").val("");
    $("#Description").val("");
    $("#errorContainer").hide();

    showInDiv('#TestForm', '/Tests/Create');
    $(".form-control").removeClass("is-invalid");
    UpdateTests();
}

function SubmitTestParametersData() {

    var mMaxMsg = "Max Value";
    var mMinMsg = "Min Value";

    if ($('#Gender').is(":checked")) {
        mMaxMsg = "Max Value(Male)";
        mMinMsg = "Min Value(Male)";

    }
    $("#createtestparameter").validate({
        rules: {

            Name: {
                required: true,
                maxlength: 500
            },
            MaleMaxValue: {
                required: true,
                greaterThan: ["#MaleMinValue", "Male Max Value"]
            },
            MaleMinValue: "required",
            FemaleMaxValue: {
                required: function () {
                    $('#Gender').is(":checked")
                },
                greaterThan: ["#FemaleMinValue", "Female Max Value"]
            },
            FemaleMinValue: {
                required: function () {
                    $('#Gender').is(":checked")
                }
            }
        },
        messages: {
            Name: {
                required: "Parameter Name is required",
                maxlength: "Parameter Name cannot be longer than 500 chars"
            },
            MaleMaxValue: {
                required: mMaxMsg + " is required",
                greaterThan: mMaxMsg + " should be greater than Min(Female)"
            },
            MaleMinValue: mMinMsg + " is required",
            FemaleMaxValue: {
                required: "Max(Female) is required",
                greaterThan: "Max(Female) should be greater than Min(Female)"
            },
            FemaleMinValue: "Minimum Value(Female) is required"
        },
        highlight: function (element, errorClass, validClass) {
            $("#errorContainer").fadeIn();
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        errorElement: 'li',
        errorLabelContainer: '#errorContainer ul',
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                success: function (response) {
                    if (response.success) {
                        ResetTestParameterForm();
                        showToast(response.message, TOAST_STATUS.SUCCESS);
                        UpdateTestParameters();
                    } else {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });

}

function ResetTestParameterForm() {

    $("#Name").val("");
    $("#MaleMaxValue").val("0");
    $("#MaleMinValue").val("0");
    $("#FemaleMaxValue").val("0");
    $("#FemaleMinValue").val("0");
    $("#ReferenceRange").val("");

    $("#Unit").val("");
    $("#errorContainer").hide();

    showInDiv('#TestParametersForm', '/TestParameters/Create');
    $(".form-control").removeClass("is-invalid");
    UpdateTestParameters();
}

function UpdateTests() {
    $.ajax({
        action: 'GET',
        url: '/Tests/GetViewAll',
        success: function (response) {

            $('#TestsDataTable').html(response.message);
            //$(".ptdatatable").DataTable();
            InitDatatables(true);
        }
    });
}

function UpdateTestParameters() {
    $.ajax({
        action: 'GET',
        url: '/TestParameters/GetViewAll',
        success: function (response) {

            $('#TestParametersDataTable').html(response.message);
            //$(".ptdatatable").DataTable();
            InitDatatables(true);
        }
    });
}

function ShowTestParameters(id) {

    let url = "/TestParameters/ShowTestParameters?id=" + id;
    showInDiv("#ParameterDataTable", url);

}

function SubmitLabReportsData() {

    $("#createlabreport").validate({
        rules: {
            ReportDeliveryDate: "required",
            ReportDeliveryTime: "required",
            PatientId: "required",
            TestId: "required",
            DoctorId: "required"
        },
        messages: {
            ReportDeliveryDate: "Delivery Date is required",
            ReportDeliveryTime: "Delivery Time is required",
            PatientId: "Patient is required",
            TestId: "Test is required",
            DoctorId: "Doctor is required"
        },
        highlight: function (element, errorClass, validClass) {
            $("#errorContainer").fadeIn();
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        errorElement: 'li',
        errorLabelContainer: '#errorContainer ul',
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                type: "POST",
                url: form.action,
                contentType: false,
                processData: false,
                data: formdata,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                success: function (response) {
                    if (response.success) {
                        ResetLabReportsForm();
                        showToast(response.message, TOAST_STATUS.SUCCESS);
                        UpdateLabReports();
                    } else {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });

}

function ResetLabReportsForm() {

    $("#datetimepicker").val("");
    $("#errorContainer").hide();
    $(".form-control").removeClass("is-invalid");
    UpdateTestParameters();
}

function SubmitReportValuesData() {

    $("#addreportvalues").validate({

        highlight: function (element, errorClass, validClass) {
            $("#errorContainer").fadeIn();
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        errorElement: 'li',
        errorLabelContainer: '#errorContainer ul',
        submitHandler: function (form) {
            var ReportValues = [];
            var count = $("#Count").val();

            if (count > 0) {
                for (i = 0; i < count; i++) {
                    var index = i + 1;
                    var idName = "#TestParameterId" + index;
                    var valueName = "#Value" + index;
                    var id = $(idName).val();
                    var v = $(valueName).val();
                    var reportValue = { "Id": id, "Value": v };
                    ReportValues.push(reportValue);
                }
            }

            var LabreportId = $("#LabReportId").val();
            var Note = $("#Note").val();
            var data = { "id": LabreportId, Note: Note, "ReportValues": ReportValues };

            $.ajax({
                type: "POST",
                url: form.action,
                data: data,
                traditional: false,
                headers: {
                    RequestVerificationToken:
                        $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                success: function (response) {
                    if (response.success) {
                        ResetLabReportsForm();
                        showToast(response.message, TOAST_STATUS.SUCCESS);
                        location.href = "/LabReports/Index";
                    } else {
                        showToast(response.message, TOAST_STATUS.DANGER);
                    }
                },
                failure: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                },
                error: function (response) {
                    showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
                }
            });

        }
    });

}

function ResetReportValuesData() {
    $(".value").val(0);
    $("#errorContainer").hide();
    $(".form-control").removeClass("is-invalid");

}

function ResetReportsForm() {


    $.ajax({
        type: "POST",
        url: '/Reciepts/RemoveReciept',
        headers: {
            RequestVerificationToken:
                $('input:hidden[name="__RequestVerificationToken"]').val()
        },
        success: function (response) {
            if (response.success) {
                $("#createreciept").hide();
                $("#Discount").val(0);
                UpdateReport();
                showToast(response.message, TOAST_STATUS.SUCCESS);
            } else {
                showToast(response.message, TOAST_STATUS.DANGER);
            }
        },
        failure: function (response) {
            showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
        },
        error: function (response) {
            showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
        }
    });
}

function RemoveProcedure(id) {

    var data = { "id": id };
    $.ajax({
        type: "POST",
        url: '/Reciepts/RemoveProcedures',
        data: data,
        headers: {
            RequestVerificationToken:
                $('input:hidden[name="__RequestVerificationToken"]').val()
        },
        success: function (response) {
            if (response.success) {
                if (response.hide) {
                    $("#createreciept").hide();
                    $("#Discount").val(0);
                }
                UpdateReport();
                showToast(response.message, TOAST_STATUS.SUCCESS);
            } else {
                showToast(response.message, TOAST_STATUS.DANGER);
            }
        },
        failure: function (response) {
            showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
        },
        error: function (response) {
            showToast("Sorry, There was some error,please try again", TOAST_STATUS.DANGER);
        }
    });
}
