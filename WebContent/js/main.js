	// 当前页
	var currentPage = 1;
	// 总记录数量
	var total = 0;
	// 默认每页显示数
	var size = 5;
	// 总页数
	var totalPage = 0;
$(document).ready(   
function() {
	getUserList(currentPage, size);
	initPagination(currentPage, total);
	// 设置分页栏的点击事件以及何时会发生高亮
	$("#pagination").on("click", "li", function() {
		var aText = $(this).find('a').html(); //假如左侧分页栏是 "上一页 1 2 下一页"，则这里就是4个<li>，
		checkA();  //首先要确定能否上一页或者下一页
		if (aText == "上一页") {
			$(".pagination > li").removeClass("active"); //移除所有的li标签的active
			$("#page" + (currentPage - 1)).addClass("active");
			$(".userListTable tbody").empty();  //清空.userListTable tbody的所有子元素
			getUserList(currentPage - 1, size);
			checkA();
		} else if (aText == "下一页") {
			$(".pagination > li").removeClass("active");
			$("#page" + (currentPage + 1)).addClass("active");
			$(".userListTable tbody").empty();
			getUserList(currentPage + 1, size);
			checkA();
		} else {
			$(".pagination > li").removeClass("active");
			$(this).addClass("active");
			$(".userListTable tbody").empty();
			getUserList($(this).text(), size);
			checkA();
		}
	})
});
//与后台获取数据，加载到页面上
function getUserList(pageNum, size) {
	currentPage = pageNum;
	$(".panel-body table tbody").html(" ");
	$.ajax({
				url : 'http://localhost:8080/bug/test/getAllProjectPage2.do',
				method : "get",
				data : {    
					"pageNum" : pageNum,
					"size" : size
				},
				async : false,
				//async属性默认为true,即异步请求。当为同步请求时JS代码加载到当前AJAX的时候会把页面里所有的代码停止加载，页面出现假死状态，当这个AJAX
				//执行完毕后才会继续运行其他代码页面假死状态解除。而异步则这个AJAX代码运行中的时候其他代码一样可以运行。
				success : function(data) {
					if (data.code == "100") {
						var length = data.rows.length; //list的长度
						currentPage = data.pageNum;
						total = data.total;
						if(total<size){
							totalPage = 1;
						}else if(total%size==0){
							totalPage = total/size;
						}else{
							totalPage = parseInt(total/size)+1;
						}
						for (var i = 0; i < length; i++) {
							var projectId = data.rows[i].projectId;
							var projectName = data.rows[i].projectName;
							var projectKey = data.rows[i].projectKey;
							var desc = data.rows[i].desc;
							var buildDate = data.rows[i].buildDate;
							var projectLeader = data.rows[i].projectLeader
							//向tbody中添加元素，一共循环length次
							$(".userListTable tbody")
								.append('<tr>'
												+ '<td>'
												+ projectId
												+ '</td>'
												+ '<td>'
												+ projectName
												+ '</td>'
												+ '<td>'
												+ projectKey
												+ '</td>'
												+ '<td>'
												+ desc
												+ '</td>'
												+ '<td>'
												+ buildDate
												+ '</td>'
												+ '<td>'
												+ projectLeader
												+ '</td>'
+ '<td><button type="button" class="btn btn-success btn-default" onclick="deleteOne('+projectId+')">删除</button><button type="button" class="btn btn-default btn-danger" onclick="updatePrepare();findOne('+projectId+')" data-toggle="modal" data-target="#editModal">修改</button></td>'
										+ '</tr>')
						}
					}
				}
			});
}
//初始化分页栏
function initPagination(pageNum, total) {
	$('#pagination').html(" ");
	$('#pagination').append(
			'<ul class="pagination" style="display:inline;">'
					+ '<span style="float: right;">每页显示'   //分页栏右侧
					+ '<select id="dataNum">'
					+ '<option value="5">5</option>'
					+ '<option value="10">10</option>'
					+ '<option value="15">15</option>'
					+ '<select>条记录,总共有' + totalPage
					+ '页，总共' + total + '条记录</span>'
					+ '</ul>')
	$("#pagination ul")  //分页栏左侧
			.append(
					'<li><a href="javascript:void(0);" id="prev">上一页</a>')
	for (var i = 1; i <= totalPage; i++) {
		$("#pagination ul").append('<li id="page'
						+ i           //这里是给数字li设置id  如果是第一页id就为page1,第二页id就为page2
						+ '"><a href="javascript:void(0);" >' + i + '</a></li>' )
	}				//javascript:void(0):意义是让超链接去执行一个js函数，而不是去跳转到一个地址。每一个li的onclick事件在ready()中已经定义了						
	$("#pagination ul")
			.append(
					'<li><a href="javascript:void(0);"  id="next">下一页</a></li>')
	
	
	$("select option[value=" + size + "]").attr(      //设置分页栏右侧下拉框选中项
			'selected', true)
	$('#page'+currentPage+'').addClass("active");   //设置分页栏左侧下page1 <li>标签为选中项（在第一次载入时为active）
	checkA();
}

//分页栏右侧下拉列表的实现
/*每次执行initPagination方法时，都要将#dataNum(分页栏右侧下拉框)添加change事件，再执行函数。
但是！change事件只会发生一次。如果第二次改变分页栏右侧下拉框选中项时，change事件将不会发生。所以
要在每次要先off #dataNum(分页栏右侧下拉框)的change事件，再添加新的change事件*/
$(document).off('change', '#dataNum').on(
		'change',
		'#dataNum',
		function() {
			size = $(this).children('option:selected')
					.val();   //改变当前能显示的数量时，就是改变size
			currentPage = 1;  //改变后，应该重新加载列表，currentPage又回到了1
			$(".userListTable tbody").empty();   //清空.userListTable tbody的所有子元素
			getUserList(currentPage, size);
			initPagination(size, total);
		});


//主要是用于检测当前页如果为首页，或者尾页时，上一页和下一页设置为不可选中状态
function checkA() {
	currentPage == 1 ? $("#prev").addClass(
			"btn btn-default disabled") : $("#prev")
			.removeClass("btn btn-default disabled");
	currentPage == totalPage ? $("#next").addClass(
			"btn btn-default disabled") : $("#next")
			.removeClass("btn btn-default disabled");
}
//修改开始
//修改操作每次需要先根据id查询当前project
function findOne(id){
	$.ajax({
		url : 'http://localhost:8080/bug/test/findOne.do',
		method : "get",
		data : {
			"id" : id
		},
		async : true,
		success : function(data) {
			row=data.row;
			if(data.code==100){
				$("#projectName").val(data.row.projectName);
				$("#projectKey").val(data.row.projectKey);
				$("#desc").val(data.row.desc);
				$("#projectLeader").val(data.row.projectLeader);
			}
			},
	}
)
}
var row={};//定义row变量
function updateOne(){
	row.projectName=$("#projectName").val();
	row.projectKey=$("#projectKey").val();
	row.desc=$("#desc").val();
	row.projectLeader=$("#projectLeader").val();
	$.ajax({
		url : 'http://localhost:8080/bug/test/update.do',
		contentType: 'application/json; charset=UTF-8',
		dataType: "json",
		method : "post",
		data : JSON.stringify(row),         //JQuery以JSON方式POST数据到服务端 需设置contentType dataType data
		async : false,
		success : function(data) {
			
			if(data.success){
				$("#saveBtn").attr("data-dismiss","modal"); ////关闭当前窗口
				$(".userListTable tbody").empty(); 
				getUserList(currentPage, size);
				
			}else{
				alert(data.message);
			}
			
			},
	}
)
}
//修改结束
//删除开始
function deleteOne(id){
	$.ajax({
		url : 'http://localhost:8080/bug/test/deleteOne.do',
		method : "get",
		data : {
			"id" : id
		},
		async : true,
		success : function(data) {
			if(data.code==100){
				$(".userListTable tbody").empty();
				if((total-1)%size==0)  //如果删除一个元素后总页数减少1
					{
					if(currentPage==1){
						getUserList(currentPage, size);
						initPagination(currentPage, total);
					}else{
						getUserList(currentPage-1, size);
						initPagination(currentPage, total);
						checkA();
					}
					}else{  //如果删除一个元素后总页数不会减少
						getUserList(currentPage, size);
						initPagination(currentPage, total);
						checkA();
					}
			}else{
				alert("删除失败");
			}
			},
	}
)
}
//删除结束
//新增开始
function addOne(){
	row={};
	row.projectId=$("#projectId").val();
	row.projectName=$("#projectName").val();
	row.projectKey=$("#projectKey").val();
	row.desc=$("#desc").val();
	row.projectLeader=$("#projectLeader").val();
	$.ajax({
		url : 'http://localhost:8080/bug/test/add.do',
		contentType: 'application/json; charset=UTF-8',
		dataType: "json",
		method : "post",
		data : JSON.stringify(row),         //JQuery以JSON方式POST数据到服务端 需设置contentType dataType data
		async : false,
		success : function(data) {
			
			if(data.success){
				$("#saveBtn").attr("data-dismiss","modal"); //关闭当前窗口
				$(".userListTable tbody").empty(); 
				if(total/size==totalPage)  //如果新增一个元素后总页数增加1
				{
					getUserList(currentPage+1, size);
					initPagination(currentPage, total);
					checkA();
				}else{  //如果新增一个元素后总页数不会增加
					getUserList(currentPage, size);
					initPagination(currentPage, total);
					checkA();
				}
				
			}else{
				alert(data.message);
			}
			
			},
	}
)
}

//新增结束
//在index页面进行新加或者修改的编辑窗口是同一个，但是，如果是新增，就需要有projectId,反之没有
var hasId=true;
function newPrepare(){
	if(!hasId){
		$("#specialDiv").attr("style","display: block;");
		hasId=true;
	}
	$("#saveBtn").attr("onclick","");
	$("#saveBtn").attr("onclick","addOne()");
	$("#projectId").val("");
	$("#projectName").val("");
	$("#projectKey").val("");
	$("#desc").val("");
	$("#projectLeader").val("");
}
function updatePrepare(){
	if(hasId){
		$("#specialDiv").attr("style","display: none;");
		hasId=false;
	}
	$("#saveBtn").attr("onclick","");
	$("#saveBtn").attr("onclick","updateOne()");
}



