export const loginRikCommand = (account: any) => {
  return `
      let node2 = cc.find("Canvas/MainUIParent/NewLobby/Footder/bottmBar@3x/Public/Layout/dnButtonSmartObjectGroup1@3x").getComponent(cc.Button);
      if (node2) {
          let touchStart = new cc.Touch(0, 0);
          let touchEnd = new cc.Touch(0, 0);
          let touchEventStart = new cc.Event.EventTouch([touchStart], false);
          touchEventStart.type = cc.Node.EventType.TOUCH_START;
          node2.node.dispatchEvent(touchEventStart);

          let touchEventEnd = new cc.Event.EventTouch([touchEnd], false);
          touchEventEnd.type = cc.Node.EventType.TOUCH_END;
          node2.node.dispatchEvent(touchEventEnd);
      }


      setTimeout(() => {
          let pathUserName = "CommonPrefabs/PopupDangNhap/popup/TenDangNhap/Username";
          let editBoxNodeUserName = cc.find(pathUserName);
          let editBoxUserName = editBoxNodeUserName.getComponent(cc.EditBox);
          if (editBoxUserName) {
              editBoxUserName.string = "${account.username}";
          } else {
              console.log("Không tìm thấy component cc.EditBox trong node");
          }

          let pathPass = "CommonPrefabs/PopupDangNhap/popup/Matkhau/Password";
          let editBoxNodePass = cc.find(pathPass);
          let editBoxPass = editBoxNodePass.getComponent(cc.EditBox);
          if (editBoxPass) {
              editBoxPass.string = "${account.password}";
          } else {
              console.log("Không tìm thấy component cc.EditBox trong node");
          }
          let nodeXacNhan = cc.find("CommonPrefabs/PopupDangNhap/popup/BtnOk").getComponent(cc.Button);
          if (nodeXacNhan) {
              let touchStart = new cc.Touch(0, 0);
              let touchEnd = new cc.Touch(0, 0);
              let touchEventStart = new cc.Event.EventTouch([touchStart], false);
              touchEventStart.type = cc.Node.EventType.TOUCH_START;
              nodeXacNhan.node.dispatchEvent(touchEventStart);

              let touchEventEnd = new cc.Event.EventTouch([touchEnd], false);
              touchEventEnd.type = cc.Node.EventType.TOUCH_END;
              nodeXacNhan.node.dispatchEvent(touchEventEnd);
          }
      }, 500);
      setTimeout(() => {
        __require('LobbyViewController').default.Instance.onClickIConGame(null,"vgcg_4");
      }, 3500);
      `;
};
export const loginHitCommand = (account: any) => {
  return `
let node2 = cc.find("Canvas/LoadingNode/listBtn/btnDangNhap").getComponent(cc.Button);
      if (node2) {
          let touchStart = new cc.Touch(0, 0);
          let touchEnd = new cc.Touch(0, 0);
          let touchEventStart = new cc.Event.EventTouch([touchStart], false);
          touchEventStart.type = cc.Node.EventType.TOUCH_START;
          node2.node.dispatchEvent(touchEventStart);

          let touchEventEnd = new cc.Event.EventTouch([touchEnd], false);
          touchEventEnd.type = cc.Node.EventType.TOUCH_END;
          node2.node.dispatchEvent(touchEventEnd);
      }
setTimeout(() => {
          let pathUserName = "Canvas/LoadingNode/PopupDangNhap/popup/NodeInfo/TenDangNhap/Username";
          let editBoxNodeUserName = cc.find(pathUserName);
          let editBoxUserName = editBoxNodeUserName.getComponent(cc.EditBox);
          if (editBoxUserName) {
              editBoxUserName.string = "${account.username}";
          } else {
              console.log("Không tìm thấy component cc.EditBox trong node username");
          }

          let pathPass = "Canvas/LoadingNode/PopupDangNhap/popup/NodeInfo/Matkhau/Password";
          let editBoxNodePass = cc.find(pathPass);
          let editBoxPass = editBoxNodePass.getComponent(cc.EditBox);
          if (editBoxPass) {
              editBoxPass.string = "${account.password}";
          } else {
              console.log("Không tìm thấy component cc.EditBox trong node matkhau");
          }
          let nodeXacNhan = cc.find("Canvas/LoadingNode/PopupDangNhap/popup/NodeInfo/nodeBottom/BtnOk").getComponent(cc.Button);
          if (nodeXacNhan) {
              let touchStart = new cc.Touch(0, 0);
              let touchEnd = new cc.Touch(0, 0);
              let touchEventStart = new cc.Event.EventTouch([touchStart], false);
              touchEventStart.type = cc.Node.EventType.TOUCH_START;
              nodeXacNhan.node.dispatchEvent(touchEventStart);

              let touchEventEnd = new cc.Event.EventTouch([touchEnd], false);
              touchEventEnd.type = cc.Node.EventType.TOUCH_END;
              nodeXacNhan.node.dispatchEvent(touchEventEnd);
          }
      },200);
      setTimeout(() => {
        __require('LobbyViewController').default.Instance.onClickIConGame(null,"vgcg_4");
     }, 3500);
     `;
};
