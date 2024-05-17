export const addNameTagCommand = (account: any) => {
  `
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
