/**
 *  form validity
 *	@version 1.8
 */
var Common = new Object();
Common.trim = function(str){
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

Common.strlen = function (str){
	var Charset = jQuery.browser.msie ?document.charset : document.characterSet
	if(Charset.toLowerCase() == 'utf-8'){
		return str.replace(/[\u4e00-\u9fa5]/g, "***").length;
	} else {
		return str.replace(/[^\x00-\xff]/g, "**").length;
	}
}

validity={
	errinput : 'errinput',
	errmsg : 'errmsg',
	errcls : 'no',
	yescls : 'yes',
	errorTip : 'error-info',
	errorinput : 'error-input',
	validTip   : 'suc-info',
	require : /[^(\s*)|(\s*)]/,	
	email : /^[a-z1-9]+([a-z0-9\+_\-\.]|[a-z0-9])+@([a-z0-9\-]+\.)+[a-z]{2,6}$/i,
	phone : /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,
	mobile : /^(13[0-9]|15[0-9]|18[8|9])\d{4,8}$/,
	url : /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
	urlnohttp : /^[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
	idCard : "this.isIdCard(value)",
	currency : /^\d+(\.\d+)?$/,
	number : /^\d+$/,
	zip : /^[1-9]\d{5}$/,
	ip  : /^[\d\.]{7,15}$/,
	qq : /^[1-9]\d{4,12}$/,
	integer : /^[-\+]?\d+$/,
	double : /^[-\+]?\d+(\.\d+)?$/,
	english : /^[A-Za-z]+$/,
	chinese : /^[\u0391-\uFFE5]+$/,
	chineseName: /^[\u0391-\uFFE5]{2,4}$/,
	userName : /^[a-z0-9_]{3,}$/i,
	//unSafe : /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
	unSafe : /[<>\?\#\$\*\&;\\\/\[\]\{\}=\(\)\.\^��\+\|,:%,]/,
	//safeStr : /[^#\'\"~\.\*\$&;\\\/\|]/,
	isSafe : function(str){return !this.unSafe.test(str);},
	safeString : "this.isSafe(value)",
	filter : "this.doFilter(value)",
	limit : "this.checkLimit(Common.strlen(value))",
	limitB : "this.checkLimit(this.LenB(value))",
	date : "this.isDate(value)",
	repeat : "this.checkRepeat(value)",
	range : "this.checkRange(value)",
	compare : "this.checkCompare(value)",
	custom : "this.Exec(value)",
	group : "this.mustChecked()",
	ajax: "this.doajax(errindex)",

	isIdCard : function(number){
	var date, Ai;
	var verify = "10x98765432";
	var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
	var area = ['','','','','','','','','','','','����','���','�ӱ�','ɽ��','���ɹ�','','','','','','����','����','������','','','','','','','','�Ϻ�','����','�㽭','��΢','����','����','ɽ��','','','','����','����','����','�㶫','����','����','','','','����','�Ĵ�','����','����','����','','','','','','','����','����','�ຣ','����','�½�','','','','','','̨��','','','','','','','','','','���','����','','','','','','','','','����'];

	var re = number.match(/^(\d{2})\d{4}(((\d{2})(\d{2})(\d{2})(\d{3}))|((\d{4})(\d{2})(\d{2})(\d{3}[x\d])))$/i);
	if(re == null) return false;
	if(re[1] >= area.length || area[re[1]] == "") return false;
	if(re[2].length == 12){
		Ai = number.substr(0, 17);
		date = [re[9], re[10], re[11]].join("-");
	} else {
		Ai = number.substr(0, 6) + "19" + number.substr(6);
		date = ["19" + re[4], re[5], re[6]].join("-");
	}
	if(!this.isDate(date, "ymd")) return false;
	var sum = 0;
	for(var i = 0;i<=16;i++){
		sum += Ai.charAt(i) * Wi[i];
	}
	Ai += verify.charAt(sum%11);

	return (number.length ==15 || number.length == 18 && number == Ai);
	},

	isDate : function(op){
		var formatString = this['element'].attr('format');
		formatString = formatString || "ymd";
		var m, year, month, day;
		switch(formatString){
		case "ymd" :
			m = op.match(new RegExp("^((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})$"));
			if(m == null ) return false;
			day = m[6];
			month = m[5]*1;
			year = (m[2].length == 4) ? m[2] : GetFullYear(parseInt(m[3], 10));
		break;
		case "dmy" :
			m = op.match(new RegExp("^(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))$"));
			if(m == null ) return false;
			day = m[1];
			month = m[3]*1;
			year = (m[5].length == 4) ? m[5] : GetFullYear(parseInt(m[6], 10));
		break;
		default :
			break;
		}
		if(!parseInt(month)) return false;
		month = month==0 ?12:month;
		var date = new Date(year, month-1, day);
		return (typeof(date) == "object" && year == date.getFullYear() && month == (date.getMonth()+1) && day == date.getDate());
		function GetFullYear(y){
			return ((y<30 ? "20" : "19") + y)|0;
		}
	}, //end isDate
	doFilter : function(value){
		var filter =this['element'].attr('accept');
		return new RegExp("^.+\.(?=EXT)(EXT)$".replace(/EXT/g,filter.split(/\s*,\s*/).join("|")),"gi").test(value);
	},

	checkLimit:function(len){
		var minval=this['element'].attr('min') ||Number.MIN_VALUE;
		var maxval=this['element'].attr('max') ||Number.MAX_VALUE;
		return (minval<= len && len<=maxval);

	},

	LenB : function(str){
		return str.replace(/[^\x00-\xff]/g,"**").length;
	},

	checkRepeat:function(value){
		var to = this['element'].attr('to');
		return value==jQuery('input[id="'+to+'"]').eq(0).val();
	},

	checkRange : function(value){
		value = value|0;
		var minval=this['element'].attr('min') || Number.MIN_VALUE;
		var maxval=this['element'].attr('max') || Number.MAX_VALUE;
		return (minval<=value && value<=maxval);
	},

	checkCompare : function(value){
		var compare=this['element'].attr('compare');
		if(isNaN(value)) return false;
		value = parseInt(value);
		return eval(value+compare);
	},

	Exec : function(value){
		var reg = this['element'].attr('regexp');
		return new RegExp(reg,"gi").test(value);
	},

	mustChecked : function(){
		var tagName=this['element'].attr('name');
		var f=this['element'].parents('form');
		var n=f.find('input[name="'+tagName+'"][checked]').length;
		var count = f.find('input[name="'+tagName+'"]').length;
		var minval=this['element'].attr('min') || 1;
		var maxval=this['element'].attr('max') || count;
		return (minval<=n && n<=maxval);
	},

	doajax : function(value) {	
		var element = this['element'];
		var errindex = this['errindex'];
		var url=this['element'].attr('url');
		var msgid = jQuery('#'+element.attr('msgid'));
		var val = this['element'].val();
		var str_errmsg=this['element'].attr('msg');
		var arr_errmsg ;
		var errmsg ;
		if(str_errmsg.indexOf('|')>-1) {
      		arr_errmsg= str_errmsg.split('|') ;
      		errmsg = arr_errmsg[errindex] ;
		} else {
      		errmsg='';
		}
		var type=this['element'].attr('type');
		var Charset = jQuery.browser.msie ? document.charset : document.characterSet;
		var methodtype = (Charset.toLowerCase() == 'utf-8') ? 'post' : 'get';
		var method=this['element'].attr('method') || methodtype;
		var name = this['element'].attr('name');
		if(url=="" || url==undefined) {
            alert('Please specify url');
            return false ;
		}

		var send_data = name+"="+encodeURI(val);
		/*
		if(url.indexOf('?')>-1){
			url = url+"&"+name+"="+escape(val);
		} else {
			url = url+'?'+name+"="+escape(val);
		}
		*/
		validity.removeErr(this['element']);
		this['element'].parent('*').find('.'+validity.errorTip+',.'+validity.validTip).remove();
		var s = $.ajax({
			type: method,
			url: url,
			data: send_data,
			cache: false,
			async: false,
			success: function(data){
				data = data.replace(/(^\s*)|(\s*$)/g, "");
				if(data != 'success'){
					if(errmsg == undefined || errmsg==""){
					    errmsg = data;
					}
					(type!='checkbox' && type!='radio' && element.addClass(this['errorinput']));
					if(msgid.length>0){
						 msgid.removeClass(validity.validTip).addClass(validity.errorTip).html(errmsg);
					}else{
					    jQuery("<em class=\"form-info "+validity.errorTip+"\">&nbsp;&nbsp;&nbsp;</em>").html(errmsg).insertAfter(element);
					}
				  return false;
				}
				
				if(data=='success') {
				   if(msgid.length>0){
					   msgid.removeClass(validity.errorTip).addClass(validity.validTip).html('��ȷ');
				   }else{
					   jQuery("<em class=\"form-info "+validity.validTip+"\">��ȷ</em>").insertAfter(element);
				   }
				   return true;
				}
		   	}
		 }).responseText;
		 s = s.replace(/(^\s*)|(\s*$)/g, "");
		 return s == 'success' ? true : false;
	}
};

// element 
validity.showErr=function (element, errindex){
	var str_errmsg=element.attr('msg') ||'unkonwn';
	var arr_errmsg = str_errmsg.split('|');
	var errmsg = arr_errmsg[errindex] ? arr_errmsg[errindex]: arr_errmsg[0];
	var msgid= jQuery('#'+element.attr('msgid'));
	var type=element.attr('type');
	(type!='checkbox' && type!='radio' && element.addClass(this['errorinput']));
	
	element.parent('*').find('.'+this['errorTip']).remove();
	
	if(msgid.length>0) {
    	msgid.removeClass(this['validTip']).addClass("form-info "+this['errorTip']).html(errmsg);
	} else {
    	jQuery("<em class=\"form-info "+this['errorTip']+"\">&nbsp;&nbsp;&nbsp;</em>").html(errmsg).insertAfter(element);
	}
	return false ;
}

validity.removeErr =  function(element){
	element.removeClass(this['errorinput']);
	element.parent('*').find('.form-info').remove();
}

validity.checkajax = function(element, datatype, errindex) {
	var value=jQuery.trim(element.val());
	this['element'] = element;
	this['errindex'] = errindex;
	validity.removeErr(element);
	return eval(this[datatype]);
}

validity.checkDatatype = function(element,datatype){
	var value=jQuery.trim(element.val());
	this['element'] = element;
	validity.removeErr(element);
	switch(datatype){
		case "idCard" :
		case "date" :
		case "repeat" :
		case "range" :
		case "compare" :
		case "custom" :
		case "group" :
		case "limit" :
		case "limitB" :
		//case "isSafe" :
		case "safeString" :
		case "filter" :
		
		return eval(this[datatype]);
		break;

		default:
			return this[datatype].test(value);
			break;
		}
}

validity.check=function(obj){
	var datatype = obj.attr('datatype');
	var value = jQuery.trim(obj.val());
	var is_suc = true;
	
	if(typeof(datatype) == "undefined") return true;

	if(obj.attr('require')!="true" && value=="") return true;
	if(obj.attr('success') == "false" && typeof(obj.attr('success')) != "undefined") is_suc = false;
	var datatypes = datatype.split('|');
	var isValid = true;

	jQuery.each(datatypes,function(index,type){
		if(typeof(validity[type]) == "undefined") {
			isValid = false;
			return  false;
		}
		
		//ajax validate 
		if(type=='ajax')   return isValid = validity.checkajax(obj, type, index);
		
		if(validity.checkDatatype(obj,type)==false){  //the form element validate failed
      		obj.addClass(validity.errorinput);
			validity.showErr(obj, index);
			return isValid=false;
		} else { // validate success
			validity.showErr(obj, index);
       		obj.removeClass(validity.errorinput);
       		var msgid = jQuery('#'+obj.attr('msgid'));
			if(msgid.length>0) {
			    if(is_suc){
				    msgid.removeClass(validity.errorTip).addClass(validity.validTip).html("��ȷ");
			    }else{
			        msgid.removeClass(validity.errorTip).html("");
			    }
			} else {				
         		obj.parent('*').find('.'+validity.errorTip+',.'+validity.validTip).remove();
				if(is_suc) jQuery("<em class=\"form-info "+validity.validTip+"\">��ȷ</em>").insertAfter(obj);
			}				
		}
	});
	return isValid;
}
 
jQuery.fn.check_form = function(){
	var form=jQuery(this);
	var elements = form.find(':input[require]');
	elements.blur(function(index){
		return validity.check(jQuery(this));
	});
	
	form.submit(function(){
		var isValid = true;
		var errIndex= new Array();
		var n=0;
		elements.each(function(i){
			if(validity.check(jQuery(this))==false){
				isValid  = false;
				errIndex[n++]=i;
			};
		});

		if(isValid==false){
			elements.eq(errIndex[0]).focus().select();
			return false;
		}

		return true;
	});
}

jQuery.fn.check_submit = function(){
	var form=jQuery(this);
	var elements = form.find(':input[require]');
	elements.blur(function(index){
		return validity.check(jQuery(this));
	});
	
	form.submit(function(){
		var isValid = true;
		var errIndex= new Array();
		var n=0;
		elements.each(function(i){
			if(validity.check(jQuery(this))==false){
				isValid  = false;
				errIndex[n++]=i;
			};
		});

		if(isValid==false){
		    validity.showErr(elements.eq(errIndex[0]), errIndex[0]);
			elements.eq(errIndex[0]).focus().select();
			elements.eq(errIndex[0]).removeClass(validity.errorinput);
			return false;
		}

		return true;
	});
}

var onFormSubmit = function(pForm){
		var result = true;
		$(pForm).find("input[valid],select[valid]").each(function(i){
			if(!checkFun($(this))){
				result = false;
			}
		});
		return result;
	}
	
	var bindEvent = function(pForm){
		$(pForm).find("input[valid],select[valid]").each(function(i){
			var inputBox = $(this);
			inputBox.bind("focus",function(){
				var box = $(this);
				showInfoMsg(box);								
			});
			inputBox.bind("blur",function(){
				var box = $(this);
				checkFun(box);
			});
		});
	}
	
	var checkFun = function(box){
		var validArr = box.attr("valid").split('|');
		var errorNum = 0;
		var len = validArr.length;
		for(var i=0; i < len; i++){
			var item = validArr[i];
			var v = box.val();
			if(item == "long"){
				var min_count = (Number(box.attr("min")) || -1);
				var max_count = (Number(box.attr("max")) || -1);
				if(min_count < 0 && max_count < 0){
					continue;
				}
				else{
					if(!(v.length >= min_count && v.length <= max_count)){
						showErrorMsg(box);
						return false;
					}
				}
			}
			else{
				if(!validity[validArr[i]].test(v)){
					errorNum++;
				}
			}
		}
		if(errorNum == len){
			showErrorMsg(box);
			return false;
		}
		else{
			showSuccessMsg(box);
			return true;
		}
	}
	
	var showErrorMsg = function(box){
		var msgBox = $("#"+box.attr("msg"));
		msgBox.html(box.attr("error"));
		msgBox.addClass("error-info");
		msgBox.removeClass("suc-info");
		msgBox.removeClass("msg-info");
		msgBox.show();
	}
	
	var showSuccessMsg = function(box){
		var msgBox = $("#"+box.attr("msg"));
		msgBox.html("�ɹ�");
		msgBox.removeClass("error-info");
		msgBox.addClass("suc-info");
		msgBox.removeClass("msg-info");
		msgBox.show();
	}
	
	var showInfoMsg = function(box){
		var msgBox = $("#"+box.attr("msg"));
		if(box.attr("tips")){
			msgBox.html(box.attr("tips"));
			msgBox.removeClass("error-info");
			msgBox.removeClass("suc-info");
			msgBox.addClass("msg-info");
			msgBox.show();
		}
	}