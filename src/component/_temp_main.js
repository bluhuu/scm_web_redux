// MenuTree 的功能Action 定义
App.MenuTreePanelActions = function(MenuTree, mainWindow) {
	/**
	 * 刷新 节点内容..
	 */
	this.refresh = new Ext.Action({
		text: '刷新',
		iconCls: 'refresh',
		handler: function() {
			var node = MenuTree.getSelectNode();
			if (node.reload) {
				node.reload();
			}
		}
	});
	/**
	 * 打开指定元素
	 */
	this.open = new Ext.Action({
		text: '打开',
		iconCls: 'open',
		handler: function(btn, objEvent) {
			var node = MenuTree.getSelectNode();
			mainWindow.openModule(node.attributes.action, node.attributes.moduleID);
			//			if (node.attributes.action=='X'){
			//				if ( node.attributes.url.toLowerCase().lastIndexOf(".jsp")==node.attributes.url.length-4){
			//					mainWindow.openJspModule(node.attributes.action,node.attributes.moduleID,node.text,node.attributes.url);
			//				}
			//				else {
			//					mainWindow.openJsModule(node.attributes.action,node.attributes.moduleID,node.text,node.attributes.url);
			//				}
			//			}
		}
	});
	/**
	 * 删除当前节点代表的数据库元素
	 */
	/**	this.remove = new Ext.Action({
			text : '删除',
			iconCls : 'remove',
			handler : function(btn, objEvent) {
				var node = MenuTree.getSelectNode();
				if (confirm("您确认要删除 [" + node.text + " ]？")) {
					Ext.Ajax.request({
						scope : this,
						url : MenuTree.serviceURL + '/drop.do',
						params : {
							node : node.id,
							path : node.getPath('text'),
							text : node.text
						},
						success : function() {
							Ext.Msg.info({
								message : '[' + node.text + ' ]删除成功~',
								alignType : 'tl-tl?'
							});
							node.remove();
						},
						failure : function() {
							alert("删除失败");
						}
					});
				}
			}
		}); **/

	/**
	 * 根据当前MenuTree Node的选择情况，设置 各个Action的可见状态
	 */
	this.resetActionState = function() {
		/**var node = MenuTree.getSelectNode();
		var type = getDBElementTypeOfNode(node);
		var torv = type == "TABLE" || type == "VIEW";
		this.open.setHidden(!torv);
		this.remove.setHidden(!torv);**/
	};
	/**
	 * 取得所有 Ext.Action 类型的成员，用于外部菜单的创建
	 */
	this.getActionItems = (function() {
		var as = [];
		for (action in this) {
			if (this[action].execute) {
				// 用Ext.Action对象独有的 execute 成员作为判断的依据
				as = as.concat(this[action]);
			}
		}
		return as;
	}).createDelegate(this);
}

// MenuTree定义
App.MenuTreePanel = function(config) {
	// 后台Action URL
	Ext.apply(this, config);
	this.serviceURL = App.getContextPath() + "menuTreeAction";
	// 配置参数传入 grid 要显示的tabPanel
	//	var mainWindow = config.mainWindow;

	// Config Params.
	var cfg = {
		id: 'MenuTree',
		border: false,
		bodyBorder: false,
		autoScroll: true,
		containerScroll: true,
		rootVisible: false,
		animate: false,
		listeners: {
			contextmenu: function(node, objEvent) {
				this.select(node);
				objEvent.preventDefault();
				this.menus.showAt(objEvent.getXY());
			},
			click: function(node, objEvent) {
					if (node.leaf) {
						mainWindow.openModule(node.attributes.action, node.attributes.moduleID);
					} else if (!node.isExpanded()) {
						node.expand();
					}
				}
				//			dblclick : {
				//				scope : this,
				//				fn : function(node, objEvent) {
				//					if (node.leaf) {
				//						this.actions.open.execute();
				//					}
				//				}
				//			}
		},
		root: new Ext.tree.AsyncTreeNode({
			id: this.id,
			icon: App.getContextPath() + 'images/menu.png',
			text: '正在加载...'
		}),
		loader: new Ext.tree.TreeLoader({
			url: this.serviceURL + "/tree.do",
			listeners: {
				scope: this,
				beforeload: function(loader, node) {
					loader.baseParams.path = node.getPath('text');
					loader.baseParams.nodeID = node.id;
					//loader.baseParams.path = '菜单/'+this.title;
					//loader.baseParams.nodeID = this.id;
				},
				load: function(loader, node, response) {
					f = function(node) {
						//alert(node.text+"="+node.attributes.readOnly);
						App.registerModuleInfo(node.attributes.action + '_' + node.attributes.moduleID, {
							title: node.text,
							url: node.attributes.url,
							readOnly: node.attributes.readOnly,
							canExport: node.attributes.canExport,
							canReport: node.attributes.canReport
						});
					};

					if (node.attributes.moduleId) {
						f(node);
					}
					node.eachChild(f);
				}
			}
		})
	};
	config = Ext.applyIf(config || {}, cfg);

	// call 父类构建器
	App.MenuTreePanel.superclass.constructor.call(this, config);

	// 初始功能菜单
	this.actions = new App.MenuTreePanelActions(this, this.mainWindow);

	this.menus = new Ext.menu.Menu({
		listeners: {
			beforeshow: {
				scope: this,
				fn: function() {
					this.actions.resetActionState();
				}
			}
		}
	});
	var treeActions = this.actions.getActionItems();
	for (var i = 0; i < treeActions.length; i++) {
		var action = treeActions[i];
		this.menus.add(action);
	}
}
Ext.extend(App.MenuTreePanel, Ext.tree.TreePanel, {
	select: function(node) { // 选择指定Node.
		this.getSelectionModel().select(node);
		node.expand();
	},
	getSelectNode: function() {
		var current = this.getSelectionModel().getSelectedNode();
		if (current) {
			return current;
		}
		return this.getRootNode();
	}
});

// App.TopPanel = function(config) {
// var cfg = {
// frame : true,
// html : "",
// bodyStyle : "padding:0Px;text-align:right;font-size:8px"
// };
// config = Ext.applyIf(config || {}, cfg);
//
// // call 父类构建器
// App.TopPanel.superclass.constructor.call(this, config);
// }
//
// Ext.extend(App.TopPanel, Ext.Panel, {
// // setUserName: function(userName) {
// // this.userName = username;
// // updateDisplay(this.userName,this.cartCount);
// // },
// // setcartCount: function(cartCount){
// // this.cartCount = cartCount;
// // updateDiaplay(this.userName,this.cartCount);
// // },
// updateDisplay : function(cartCount) {
// // panel.body.dom.innerHTML=myMsg;
// userName = App.getContextValue("#UserRealName");
// orgName = App.getContextValue("#AD_Org_Name");
// bpartnerName = App.getContextValue("#BPartnerName");
// userID = App.getContextValue('#AD_User_ID');
// isAdmin = userID == '100';
// adminstr = (isAdmin
// ? "<a href=\"#\"
// onclick=\"mainWindow.clearServerCache();\">清除缓存</a>&nbsp;|&nbsp;"
// : "");
// loginTime = App.getContextValue("#LoginTime");
// this.body.dom.innerHTML = "<table style='font-size:9pt' width=100%><tr><td
// align='center' width=50%>"
// + "欢迎您，"
// + (orgName ? orgName : "")
// + "-"
// + (userName ? userName : "")
// +"</td><td alig='right',width=20%> "
// + adminstr
// "<a href=\"#\" onclick=\"mainWindow.modifyPwd();\">修改密码</a>&nbsp;|&nbsp;<a
// href=\"#\"
// onclick=\"App.getMainWindow().logout();\">退出登录</a>&nbsp;</td></tr></table>";
// }
// });

App.Header = function(config) {
	App.Header.superclass.constructor.call(this, {

		region: 'north',
		height: 56,
		layout: 'border',
		items: [{
			region: 'west',
			width: document.body.clientWidth,
			id: 'bar',
			border: false,
			html: "<table width='100%' height='100%' style='background-repeat: no-repeat' background='" + App.getContextPath() + "images/b2b_header.jpg' bgcolor='#bbd0ed'>" + "<td> <h2 style='float: left;color: #ffffff;font-size: 30px;line-height: 50px;'>B2B电商平台</h2><span style='color: #e8e8e8;font-size: 18px;line-height: 66px;margin-left: 10px;'>B2B electronic business platform</span></td></table>"
		}, {
			region: 'center',
			bodyStyle: {
				'background-color': '#bbd0ed'
			},
			border: false
		}, {
			region: 'east',
			border: false,
			id: 'user-nav',
			width: 750,
			bodyStyle: {
				'background-color': '#bbd0ed'
			},
			html: ''
		}]
	});

};



Ext.extend(App.Header, Ext.Panel, {
	updateDisplay: function(cartCount) {
		// panel.body.dom.innerHTML=myMsg;
		userName = App.getContextValue("#UserRealName");
		orgName = App.getContextValue("#AD_Org_Name");
		bpartnerName = App.getContextValue("#OrgName");
		userID = App.getContextValue('#AD_User_ID');
		isAdmin = userID == '100';
		adminstr = (isAdmin ? "<a style='color:#ffffff' href=\"#\" onclick=\"mainWindow.clearServerCache();\">清除缓存</a>&nbsp;|&nbsp;" : "<a style='color:#ffffff' href=\"#\" onclick=\"mainWindow.modifyPwd();\">修改密码</a>&nbsp;|&nbsp;");
		loginTime = App.getContextValue("#LoginTime");
		Ext.get('user-nav').dom.innerHTML = "<table style='font-size:9pt;color:#ffffff;' width=50% align='right'>" +
			"<tr>" +
			"<td height='30' colspan='2'></td>" +
			"</tr>" +
			"<tr><td align='right' width=60%>" + "欢迎您，"
			//				+ (orgName ? orgName != '*' ? (orgName + "-") : "" : "")
			+ (userName ? userName : "") + "</td><td align='right',width=60 > " + adminstr + "<a style='color:#ffffff' href=\"#\" onclick=\"App.getMainWindow().logout();\">退出登录</a>&nbsp;</td></tr></table>";

		// this.body.dom.innerHTML = "<table style='font-size:9pt'
		// width=100%><tr><td align='center' width=50%>"
		// + "欢迎您，"
		// + (orgName ? orgName : "")
		// + "-"
		// + (userName ? userName : "")
		// +"</td><td alig='right',width=20%> "
		// + adminstr
		// "<a href=\"#\"
		// onclick=\"mainWindow.modifyPwd();\">修改密码</a>&nbsp;|&nbsp;<a
		// href=\"#\"
		// onclick=\"App.getMainWindow().logout();\">退出登录</a>&nbsp;</td></tr></table>";
	}
});

// 主窗口定义..
App.MainWindow = function(config) {
	var mainPanel = new Ext.TabPanel({
		region: 'center',
		margins: '5 5 5 0',
		autoScroll: false,
		enableTabScroll: true,
		activeTab: 0,
		frame: true,
		plain: true,
		plugins: new Ext.ux.TabCloseMenu(),
		//		listeners : {
		//			// bodyresize : function(panel, width, height) {
		//			// if (Ext.isIE6) {
		//			// var grid = panel.items.get(0);
		//			// var size = grid.getSize();
		//			// // alert("o.grid.size:" + Ext.encode(size));
		//			// // grid.setSize(psize);
		//			// grid.setWidth(width - 10);
		//			// grid.setHeight(height);
		//			// // size = grid.getSize();
		//			// // alert("n.grid.size:" + Ext.encode(size));
		//			// // alert('panel.size,width:' + width + ",height:" + height);
		//			// }
		//			// },
		//			tabchange :function(tabPanel,tab){
		//			},
		//			activate : function(panel) {
		//			}
		//		},
		defaults: {
			layout: 'fit',
			autoScroll: true,
			// autoWidth : true,
			// autoHeight : true,
			autoSize: true
		}
		//		items : [
		//			
		//				{
		//					id : 'tabWelcome',
		//					layout : 'fit',
		//					title : '首页',
		//					closable : false,
		//					items : [
		//						new  App.Portal.PortalPanel()
		////						{
		////						xtype : 'iframepanel',
		////						defaultSrc : function() {
		////							return App.getContextPath()+'/system/portal/portal.jsp';
		////						}
		////					}
		//					],
		//					listeners : {
		//						scope : this,
		//						activate : {
		//							fn : function(p) {
		////								if (this.mainPanel.items.length != 1) {
		////									var item = p.items;
		////									item.items[0].items.items[0].items.items[0].store.reload();
		////									item.items[0].items.items[1].items.items[0].store.reload();
		////								}
		//							}
		//						}
		//					}
		//					
		//			}
		//		]
		// [{
		// id : 'tabWelcome',
		// layout : 'fit',
		// title : '首页',
		// closable : false,
		// // html : '<h1>Welcome Tabpanel~.</h1>'
		// items : [this.welcomePanel]
		// }]
	});

	// create MenuTreePanel
	this.menuStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: App.getContextPath() + "menuTreeAction/loadAccordion.do"
		}),
		reader: new Ext.data.JsonReader({
			root: 'rows',
			totalProperty: 'total',
			id: 'id'
		}, [{
			name: 'id',
			mapping: 'id'
		}, {
			name: 'text',
			mapping: 'text'
		}]),
		listeners: {
			load: {
				scope: this,
				fn: function(store, records, opt) {
					this.initMenu();
				}
			},
			exception: function(proxy, type, action, options, result, arg) {
				// load 数据失败..
				App.handleError("加载数据失败", type, result);
			}
		}

	});

	this.accordionPanel = new Ext.Panel({
		layout: 'accordion',
		layoutConfig: {
			animate: true
		},
		items: []
	});

	this.leftPanel = new Ext.Panel({
		id: 'menutreePanel',
		title: '导航',
		region: 'west',
		border: false,
		layout: 'fit',
		margins: '5 0 5 5',
		collapsible: true,
		collapseMode: 'mini',
		split: true,
		minSize: 100,
		width: 180,
		items: [this.accordionPanel]
	});
	var topPanel = new App.Header({
		title: config.title
	});

	// create TopPanel
	// var topPanel = new Ext.Panel({
	// region : 'north',
	// //title : 'Link11协同商务系统1.0版',
	// plain : true,
	// frame : false,
	// border : false,
	// autoScroll : false,
	// autoSize : true,
	// border : false,
	// height : 26, //for IE6
	// tools : [
	// {
	// id : 'gear',
	// scope : this,
	// xtype:'button',
	// qtip : '修改密码',
	// text: '修改密码',
	// handler : function() {
	// win_password.show();
	// }
	// },
	// {
	// id : 'close',
	// scope : this,
	// qtip : '退出系统',
	// handler : function() {
	// this.actions.exit();
	// }
	// }]
	// });

	var bottomPanel = new Ext.Panel({
		region: "south",
		frame: true,
		html: config.copyright,
		bodyStyle: "padding:0Px;text-align:center;font-size:12px"
	});
	this.mainPanel = mainPanel;
	this.topPanel = topPanel;
	// Config Params.
	var cfg = {
		layout: 'border',
		// renderTo: Ext.getBody(),
		items: [topPanel, this.leftPanel, mainPanel, bottomPanel]
	};
	config = Ext.applyIf(config || {}, cfg);
	// //for debug
	// var m = App.TestWindow;
	// m.moduleId = 1000205;
	// m.action = 'X';
	// this.modules.push(m);

	// call 父类构建器
	App.MainWindow.superclass.constructor.call(this, config);
	this.leftPanel.expand(false);
	//	(function() {
	//		this.welcomePanel = new App.Portal.PortalPanel();
	//		var panel = this.mainPanel.add({
	//			id : 'tabWelcome',
	//			layout : 'fit',
	//			title : '首页',
	//			closable : false,
	//			items : [this.welcomePanel],
	//			listeners : {
	//				scope : this,
	//				activate : {
	//					fn : function(p) {
	//						if (this.mainPanel.items.length != 1) {
	//							var item = p.items;
	//							item.items[0].items.items[0].items.items[0].store.reload();
	//							item.items[0].items.items[1].items.items[0].store.reload();
	//						}
	//					}
	//				}
	//			}
	//		});
	//		// this.mainPanel.doLayout();
	//		panel.show();
	//	}).defer(100, this)

}
Ext.extend(App.MainWindow, Ext.Viewport, {
	// modules: [],
	ie6Fix: function() {
		// fix toppanel..
		var topp = this.items.get(0); // 取得toppanel
		var tope = topp.getEl();
		var last = tope.last();
		last.remove();
		this.doLayout();
	},
	initMenu: function() {
		for (var index = 0; index < this.menuStore.getCount(); index++) {
			var r = this.menuStore.getAt(index);
			var treePanel = new App.MenuTreePanel({
				title: r.data.text,
				id: r.data.id,
				mainWindow: this
			});

			// create mainMenus,合并 menutree上的Actions 和main Actions
			//this.actions = new App.Actions(this);
			//			var treeActions = treePanel.actions.getActionItems();
			//			var menus = new Ext.menu.Menu({
			//				listeners : {
			//					beforeshow : {
			//						scope : this,
			//						fn : function(btn, objEvent) {
			//							// 菜单显示前重置 显示状态
			//							treePanel.actions.resetActionState();
			//						}
			//					}
			//				}
			//			});
			//			for (var i = 0; i < treeActions.length; i++) {
			//				var action = treeActions[i];
			//				menus.add(action);
			//			}
			//			menus.addSeparator();
			// menus.add(this.actions.configAction);
			//menus.add(this.actions.exitAction);
			this.accordionPanel.add(treePanel);
		}
		this.leftPanel.doLayout();
	},
	init: function(callback) {
		// alert('init:数据初始化~~');
		this.topPanel.updateDisplay();
		this.menuStore.load();
		(function() {
			this.mainPanel.add({
				id: 'tabWelcome',
				layout: 'fit',
				title: '首页',
				closable: false,
				autoScroll: false,
				items: [
					new App.Portal.PortalPanel({
						region: 'center'
					})
				]
			});
			this.mainPanel.getItem('tabWelcome').show();
		}).defer(0, this);

	},
	// setTopText: function(cartCount){
	// this.topPanel.updateDisplay(cartCount);
	// },
	login: function(callback) {
		// 登录数据库
		if (!App.loginWindow) {
			// alert('Create Login Window');
			App.loginWindow = new App.LoginWindow();
			App.loginWindow.successCallback = callback;
		}
		// alert('Show Login');
		App.loginWindow.show();
		App.loginWindow.load();
	},
	logout: function() {
		this.exit();
		//		Ext.Msg.confirm('退出登录', '确认要退出登录吗？', function(btn){
		//		    if (btn == 'yes'){
		// process text value and close...
		//App.getMainWindow().actions.exit();
		//		    }
		//		});
	},
	modifyAccount: function() {
		//		if (App.isVendor()){
		//			 var w = new App.Vendor.VendorForm({
		//			 	title : '修改供应商',
		//			 	vendor: true
		//			 });
		//			 w.show();
		//		}
		//		else if (App.isCustomer()){
		//			 var w = new App.Customer.CustomerForm({
		//			 	title : '修改客户',
		//			 	customer: true
		//			 });
		//			 w.show();
		//		}
	},
	modifyPwd: function() {
		if (!this.win_password) {
			var updatePasswordForm = new Ext.form.FormPanel({
				id: 'updatePasswordForm',
				// bodyStyle:"text-align:center",
				defaultType: 'textfield',
				labelAlign: 'right',
				labelWidth: 100,
				frame: true,
				width: 220,
				items: [{
					// xtype:'textfield',
					fieldLabel: '原密码',
					id: 'p_Old_Password',
					allowBlank: false,
					anchor: "95%",
					blankText: '原密码不能为空',
					inputType: 'password'

				}, {
					// xtype:'textfield',
					fieldLabel: '新密码',
					id: 'p_New_Password',
					allowBlank: false,
					maxLength: 20,
					minLength: 6,
					anchor: "95%",
					blankText: '新密码不能为空',
					inputType: 'password'
				}, {
					// xtype:'textfield',
					fieldLabel: '确认新密码',
					id: 'p_New_PasswordConfirm',
					allowBlank: false,
					maxLength: 20,
					minLength: 6,
					anchor: "95%",
					blankText: '确认新密码不能为空',
					inputType: 'password'
				}]
			});
			var win_password = new Ext.Window({
				id: 'win_password',
				layout: 'fit',
				title: "",
				width: 300,
				height: 200,
				title: '修改密码',
				// closeAction : 'hide',
				maximizable: true,
				items: [updatePasswordForm],
				buttons: [{
					text: '确认',
					width: 60,
					// icon : App.getContextPath()+'images/query.gif',
					iconAlign: 'right',
					handler: function() {
						var oldPassword = Ext.getCmp('p_Old_Password')
							.getValue();
						var newPassword = Ext.getCmp('p_New_Password')
							.getValue();
						var newPasswordConfirm = Ext
							.getCmp('p_New_PasswordConfirm').getValue();
						if (newPassword != newPasswordConfirm) {
							alert("新密码两次输入不一致！");
							return false;
						}
						if (newPassword.length == 0 || newPassword.length == 0 || newPasswordConfirm.length == 0) {
							alert("新密码不允许为空！");
							return false;
						}
						win_password.hide();

						var sSend = "["
						sSend = sSend + "{oldPassword:'" + oldPassword + "', newPassword:'" + newPassword + "'}";
						sSend = sSend + "]";

						sSend = Ext.util.JSON.encode(sSend);
						Ext.Ajax.request({
							url: App.getContextPath() + 'appAction/updatePassword.do',
							method: 'POST',
							success: function(result, request) {
								var jsonData = Ext.util.JSON
									.decode(result.responseText);
								if (jsonData.success) {
									Ext.MessageBox.alert('修改成功!');
									updatePasswordForm.form.reset();
								} else {
									Ext.MessageBox.alert('提交失败: ' + jsonData.msg);
								}
							},
							failure: function(result, request) {
								Ext.MessageBox.alert('提交失败: ' + result.responseText);
								// updatePasswordForm.form.reset();
							},
							params: {
								data: sSend
							}
						});
					}

				}, {
					text: '取消',
					handler: function() {
						updatePasswordForm.form.reset();
						win_password.hide();
					}
				}]

			});
			this.win_password = win_password;
		}
		this.win_password.show();
	},

	// showCart: function() {
	// var moduleId = "cart";
	// var m = this.getModule(moduleId);
	// if (m){
	// m.items.items[0].refresh();
	// this.mainPanel.setActiveTab(m);
	// }
	// else {
	// var modulePanel= new App.CartTab();
	// this.addModule(moduleId,"购物车",modulePanel);
	// }
	//		
	// },
	// refreshCart: function() {
	// var moduleId = "cart";
	// var m = this.getModule(moduleId);
	// if (m){
	// m.items.items[0].refresh(); //购物车页签刷新后会更新头部显示
	// }
	// else {
	// App.getMainWindow().refreshCartCount(); //只刷新头部显示
	// }
	//			
	// },
	// refreshCartCount: function() {
	// this.setTopText(App.getContextValue("#CartCount"));
	// },
	// refresh : function() {
	// // 登录后 刷新页面内容.刷新MenuTree
	// Ext.Ajax.request({
	// url : App.getContextPath()+"menuTreeAction/tree.do",
	// scope : this,
	// success : function(response) {
	// var json = response.responseText;
	// // alert("请求数据库结构成功：" + json);
	// var rst = eval("(" + json + ")");
	//
	// // var root = this.treePanel.getRootNode();
	// // root.setText(rst.text);
	// // this.treePanel.select(root);
	// if (rst.ctx){
	// for (prop in rst.ctx){
	// App.setContextValue(prop,rst.ctx[prop]);
	// }
	// }
	// this.refreshCartCount();
	// },
	// failure : function(response) {
	// if (response.status == 200) {
	// var json = response.responseText.trim();
	// alert("Load TreePanel失败：" + json);
	// } else {
	// var msg = response.statusText;
	// msg += "[" + response.status + "]";
	// alert('Load TreePanel出错:' + msg);
	// }
	// }
	// });
	// },
	// TODO
	showNotification: function(config) {
		// var win = new Ext.ux.Notification(Ext.apply({
		// animateTarget: taskbarEl
		// , autoDestroy: true
		// , hideDelay: 5000
		// , html: ''
		// , iconCls: 'x-icon-waiting'
		// , title: ''
		// }, config));
		// win.show();
		//
		// return win;
	},
	hideNotification: function(win, delay) {
		// if(win){
		// (function(){ win.animHide(); }).defer(delay || 3000);
		// }
	},
	addModule: function(moduleId, moduleName, modulePanel) {
		modulePanel.moduleId = moduleId;
		modulePanel.moduleName = moduleName;
		var panel = this.mainPanel.add({
			id: "tab_" + moduleId,
			title: moduleName,
			autoScroll: true,
			closable: true,
			plain: true,
			layout: 'fit',
			items: modulePanel,
			listeners: {
				'beforeclose': modulePanel.beforeClose ? modulePanel.beforeClose.createDelegate(modulePanel) : function(e) {
					return true;
				},
				'activate': function(panel) {
					if (panel.items.items[0].activate)
						panel.items.items[0].activate.call(panel.items.items[0], panel.items.items[0]);
				},
				'deactivate': function(panel) {
					if (panel.items.items[0].deactivate)
						panel.items.items[0].deactivate.call(panel.items.items[0], panel.items.items[0]);
				}
			}

		});
		// this.mainPanel.doLayout();
		this.mainPanel.setActiveTab(panel);
		//panel.show();
		return panel;
	},

	// setModuleTitle: function(moduleId,title){
	// this.mainPanel.getTabEl("tab_"+moduleId).getEl().setTitle(title);
	// //this.getModule(moduleId).getEl().child('.x-tab-strip-text').update(title);
	// },
	getModule: function(moduleId) {
		return this.mainPanel.getItem("tab_" + moduleId);
	},

	showModule: function(moduleId, callback) {
		var tab = this.getModule(moduleId);
		if (tab) {
			this.mainPanel.setActiveTab(tab);
			if (callback) {
				callback(tab.items.items[0]);
			}
		}
	},
	closeModule: function(moduleId) {
		var tab = this.getModule(moduleId);
		if (tab)
			this.mainPanel.remove(tab, true);
	},

	// getModuleClass: function(action,moduleId) {
	// var ms = this.modules;
	//    	
	// for(var i = 0, len = ms.length; i < len; i++){
	// if(ms[i].action == action && ms[i].moduleId == moduleId){
	// return ms[i];
	// }
	// }
	//        
	// return null;
	// },
	loadModule: function(action, moduleId, moduleName, url, readOnly, config, callback) {
		//alert("modle="+moduleName +",readOnly="+readOnly);
		if (!Ext.isDefined(readOnly)) {
			readOnly = false;
		} else if (typeof(readOnly) == 'string') {
			readOnly = !('N' == readOnly || 'n' == readOnly);
		}
		this.loadModulePanel(action, moduleId, moduleName, url, true, config, callback,
			function(action, moduleId, moduleName, moduleClass, config, callback) {
				var modulePanel;
				if (config) {
					config = Ext.applyIf(config, {
						moduleId: action + "_" + moduleId,
						readOnly: readOnly
					});
					modulePanel = new moduleClass(config);
				} else {
					modulePanel = new moduleClass({
						moduleId: action + "_" + moduleId,
						readOnly: readOnly
					});
				}
				if (!modulePanel.moduleId)
					modulePanel.moduleId = (config && config.moduleId) ? config.moduleId : (action + '_' + moduleId);
				this.addModule(modulePanel.moduleId, moduleName, modulePanel);
				if (callback) {
					callback(modulePanel);
				}
			}.createDelegate(this));

	},

	loadModulePanel: function(action, moduleId, moduleName, url, showWait, config, moduleCallback, callback) {
		// this.mainPanel.loadMask.show();
		//无论模块类是否加载，均需检查该模块所有js是否都已加载，否则如果其他模块引用了此模块类js，会造成该模块类依赖的js没有加载
		var loadurl = '';
		var files = url.split(';');
		var loadMainClass = false;
		for (i = 0; i < files.length; i++) {
			if (!App.isScriptLoad(files[i])) {
				if (loadurl.length > 0)
					loadurl = loadurl + ';';
				loadurl = loadurl + files[i];
				if (i == files.length - 1) //load lasturl
					loadMainClass = true;
			}
		}
		var m = App.getModuleClass(action + '_' + moduleId);
		if (m && !loadurl) {
			callback(action, moduleId, moduleName, m, config, moduleCallback);
		} else {
			var wait;
			if (showWait)
				wait = Ext.Msg.wait('正在加载' + moduleName + '...', '请稍等');
			//alert(url);
			//alert(loadjs);
			Ext.Ajax.request({
				url: App.getContextPath() + 'appAction/loadModule.do',
				params: {
					moduleId: moduleId,
					action: action,
					url: loadurl
				},
				success: function(o) {
					if (wait)
						wait.getDialog().close();
					if (o.responseText && o.responseText !== '') {
						try {
							var m1 = eval(o.responseText);
							var m = App.getModuleClass(action + '_' + moduleId);
							if (loadMainClass || !m)
								m = m1;
							if (m) {
								App.registerModule(action + '_' + moduleId, m);
								var files = loadurl.split(';');
								for (i = 0; i < files.length; i++) {
									App.registerScript(files[i]);
								}

								callback(action, moduleId, moduleName, m, config, moduleCallback);
								//								var modulePanel = new m({
								//									moduleId : action + "_" + moduleId
								//								});

								//								modulePanel.moduleId = action + '_' + moduleId;
								//								this.addModule(action + "_" + moduleId,
								//										moduleName, modulePanel);
							} else {
								alert('加载模块错误.');
							}
						} catch (error) {
							if (o.responseText.indexOf('{') == 0) {
								try {
									var m = eval("(" + o.responseText + ")");
									if (m.msg) {
										App.handleError('加载模块错误', 'remote', m);
									} else
										alert('加载模块错误: ' + error);
								} catch (error1) {
									alert('加载模块错误: ' + error);
								}
							} else {
								alert('加载模块错误: ' + error);
							}
						}
						// this.mainPanel.loadMask.hide();
					} else {
						alert('加载模块错误: 没有找到文件！');
					}
				},
				failure: function() {
					if (wait)
						wait.getDialog().close();
					alert('连接服务器失败!');
				},
				scope: this
			});

		}
	},

	//打开Js模块
	openModule: function(action, moduleId, title, config, callback) {
		var mi = App.getModuleInfo(action + '_' + moduleId);
		if (!mi) {
			Ext.Ajax.request({
				url: App.getContextPath() + 'appAction/getModuleInfo.do',
				params: {
					moduleId: moduleId,
					action: action
				},
				success: function(o) {
					if (o.responseText && o.responseText !== '') {
						try {
							var m = eval("(" + o.responseText + ")");
							if (m) {
								if (m.success) {
									App.registerModuleInfo(action + '_' + moduleId, m.data);
									this.openModule(action, moduleId, title, config, callback);
								} else {
									alert('加载模块错误.: ' + m.msg);
								}
							} else {
								//wait.getDialog().close();
								alert('加载模块错误.');
							}
						} catch (error) {
							//wait.getDialog().close();
							alert('加载模块错误.: ' + error);
						}
						// this.mainPanel.loadMask.hide();
					} else {
						//wait.getDialog().close();
						alert('加载模块错误！');
					}
				},
				failure: function() {
					//wait.getDialog().close();
					alert('连接服务器失败!');
				},
				scope: this
			});
			return;

		}
		title = title ? title : mi.title;
		if (mi.url.toLowerCase().lastIndexOf(".jsp") == mi.url.length - 4 || mi.url.toLowerCase().lastIndexOf(".htm") == mi.url.length - 4 || mi.url.toLowerCase().lastIndexOf(".html") == mi.url.length - 5 || mi.url.toLowerCase().lastIndexOf(".pdf") == mi.url.length - 4) {
			//config and callback not support
			var m = this.getModule(action + "_" + moduleId);
			if (!m) {
				//App.registerModule(action + '_' + moduleId, m);
				var modulePanel = new Ext.ux.ManagedIframePanel({
					height: 300,
					defaultSrc: function() {
						return App.getContextPath() + 'system/' + mi.url + "?moduleId=" + action + '_' + moduleId + "&readOnly=" + (mi.readOnly && !"N" == mi.readOnly) + "&moduleName=" + title;
					}
				});
				modulePanel.moduleId = action + '_' + moduleId;
				this.addModule(modulePanel.moduleId,
					title, modulePanel);
			} else {
				this.showModule(action + "_" + moduleId);

			}
		} else {
			//				alert(moduleId);
			//				if (moduleId=='1000347')
			//					alert(mi.readOnly);
			var modulePanelId = (config && config.moduleId) ? config.moduleId : (action + "_" + moduleId);
			var m = this.getModule(modulePanelId);
			if (!m) {
				if (action == "W") {
					var wait = Ext.Msg.wait('读取中...', '请稍等');
					App.getWindowInfo(moduleId, function(windowinfo) {
						wait.getDialog().close();
						if (windowinfo) {
							// 取得了结构信息，准备构建动态窗口...
							var grid = new App.BaseWindow({
								window: windowinfo
							});
							panel = this.addModule(moduleId, title, grid);
						}
						//
					});
				} else if (action == "X") {
					config = Ext.applyIf(config || {}, mi);
					//ModuleInfo中的title会传递到ModulePanel上，此处需移除
					delete config.title;
					this.loadModule(action, moduleId, title, mi.url, mi.readOnly, config, callback);
				} else {
					alert('未知的类型：' + action);
				}
			} else {
				this.showModule(modulePanelId, callback);
			}
		}
	},
	//	 openJsModule: function(action,moduleId, title,jsfile) {
	//			var m = this.getModule(action+"_"+moduleId); 
	//			if (!m) {
	//				if (action == "X" ) {
	//					this.loadModule(action,moduleId,title,jsfile);
	//				}
	//				else {
	//					alert('未知的类型：' + action);
	//				}
	//			} else {
	//				this.showModule(action+"_"+moduleId);
	//			}
	//	 },
	//	 openJspModule: function(action,moduleId, title,url) {
	//			var m = this.getModule(action+"_"+moduleId); 
	//			if (!m) {
	//				//App.registerModule(action + '_' + moduleId, m);
	//				var modulePanel = new Ext.ux.ManagedIframePanel({
	//					height: 300,
	//					defaultSrc : function() {
	//						return App.getContextPath()+'system/'+url;
	//					}
	//				});
	//				modulePanel.moduleId = action + '_' + moduleId;
	//				this.addModule(action + "_" + moduleId,
	//						title, modulePanel);
	//			} else {
	//				this.showModule(action+"_"+moduleId);
	//			}
	//	 },
	clearServerCache: function() {
		Ext.Msg.confirm("确认", "确认清除服务器缓存吗?", function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url: App.getContextPath() + 'appAction/clearCache.do',
					success: function(result) {
						var m = Ext.util.JSON.decode(result.responseText);
						if (m.success) {
							alert('清除缓存成功.');
						} else {
							alert('清除缓存失败:' + m.msg);
						}
					},
					failure: function() {
						alert('清除缓存失败:');
					},
					scope: this
				});
			}
		});
	},
	exit: function() {
		Ext.Msg.show({
			title: '确认',
			msg: '您确认要退出系统吗?',
			buttons: Ext.Msg.YESNO,
			fn: function(btn) {;
				if (btn == 'yes') {
					Ext.TaskMgr.stopAll();
					Ext.Ajax.request({
						url: App.getContextPath() + 'initAction/logout.do',
						success: function(response) {
							window.location.href = App.getContextPath() + "login.jsp"; //没有登陆的跳转到登陆界面
						},
						failure: function(response) {
							window.location.href = App.getContextPath() + "login.jsp"; //没有登陆的跳转到登陆界面
						}
					});
				}
			},
			scope: this,
			icon: Ext.Msg.QUESTION,
			width: 260,
			height: 200
		});
		//		
		//		Ext.Msg.confirm('确认','您确认要退出系统吗?',function(btn){;
		//			if (btn=='yes'){
		//				Ext.Ajax.request({
		//					url : App.getContextPath()+'initAction/logout.do',
		//					success : function(response) {
		//						window.location.href = App.getContextPath()+"login.jsp";//没有登陆的跳转到登陆界面
		//					},
		//					failure : function(response) {
		//						window.location.href = App.getContextPath()+"login.jsp";//没有登陆的跳转到登陆界面
		//					}
		//				});
		//			}
		//		});
	}
});

//修复办法，谷歌浏览器中,table的单元格实际宽度=指定宽度+padding，所以只要重写gridview里的一个方法，如下：
Ext.override(Ext.grid.GridView, {
	getColumnStyle: function(colIndex, isHeader) {
		var colModel = this.cm,
			colConfig = colModel.config,
			style = isHeader ? '' : colConfig[colIndex].css || '',
			align = colConfig[colIndex].align;

		if (Ext.isChrome) {
			style += String.format("width: {0};", parseInt(this.getColumnWidth(colIndex)) - 2 + 'px');
		} else {
			style += String.format("width: {0};", this.getColumnWidth(colIndex));
		}

		if (colModel.isHidden(colIndex)) {
			style += 'display: none; ';
		}

		if (align) {
			style += String.format("text-align: {0};", align);
		}

		return style;
	}
});

// FusionChart用中文消息
var localizedText = 'XMLLoadingText=正在接收数据&PBarLoadingText=正在加载图表&ParsingDataText=正在读取数据&ChartNoDataText=没有数据&RenderingChartText=正在渲染图表&LoadDataErrorText=加载数据时发生错误&InvalidXMLText=无效数据';

function isNaturalNumber(s) {
	var regu = "^[0-9]+$";
	var re = new RegExp(regu);
	if (s.search(re) != -1) {
		return true;
	} else {
		return false;
	}
}