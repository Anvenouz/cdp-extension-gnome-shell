const St = imports.gi.St;
const Main = imports.ui.main;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const PanelMenu = imports.ui.panelMenu;
const Clutter = imports.gi.Clutter;
// const GLib = imports.gi.GLib;
const Soup = imports.gi.Soup;
const PopupMenu = imports.ui.popupMenu;
const Gio       = imports.gi.Gio;
const REFRESH_TIME = 10;

let url = 'https://anvenouz.be/';
let _session = new Soup.SessionAsync();

const CdpIndicator = new Lang.Class({
 Name: 'CdpIndicator', Extends: PanelMenu.Button,
     _init: function () {
       this.parent(null, "Time left");
       this.buttonText = new St.Label({
           text: "Not Found",
           y_expand: true,
           y_align: Clutter.ActorAlign.CENTER
        });

       this.actor.add_actor(this.buttonText);

       this.menuItem = new PopupMenu.PopupMenuItem("Not Found", {});
       this.menuItem2 = new PopupMenu.PopupMenuItem("Not Found", {});
       this.menu.addMenuItem(this.menuItem);
       this.menu.addMenuItem(this.menuItem2);

       this._refresh();
     },
     _refresh: function () {
      if (this._timeout) {
        Mainloop.source_remove(this._timeout);
        this._timeout = null;
      }
      this._loadDate();
      // this.buttonText.set_text(date);

      // the refresh function will be called every 10 sec.
      this._timeout = Mainloop.timeout_add_seconds(REFRESH_TIME, Lang.bind(this, this._refresh));
    },
    _loadDate: function(){
        let request = Soup.Message.new('GET', url);
        _session.queue_message(request, Lang.bind(this,
         function(session, message) {
            let data = request.response_body.data;
            let json = JSON.parse(data);
            let text = json.Current.EthNet + " Eth";
            this.buttonText.set_text(text);
            this.menuItem.label.set_text( "Net   : " + json.Current.DaiNet + " DAI");
            this.menuItem2.label.set_text("Price : "+ json.Current.Price + "   $");
         })
        );
    }
});

let twMenu;

function init() {
}

function enable() {
  twMenu = new CdpIndicator;
  Main.panel.addToStatusArea('tw-cdp-indicator', twMenu);
}

function disable() {
  twMenu.destroy();
}