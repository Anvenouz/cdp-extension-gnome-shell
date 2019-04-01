const St = imports.gi.St;
const Main = imports.ui.main;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const PanelMenu = imports.ui.panelMenu;
const Clutter = imports.gi.Clutter;
// const GLib = imports.gi.GLib;
const Soup = imports.gi.Soup;


let url = 'https://anvenouz.be/';
let _session = new Soup.SessionAsync();

const CdpIndicator = new Lang.Class({
 Name: 'CdpIndicator', Extends: PanelMenu.Button,
     _init: function ()
     {
       let d = new Date();
       let time = d.getTime().toString();
       this.parent(null, "Time left");
       this.buttonText = new St.Label({
           text: time,
           y_expand: true,
           y_align: Clutter.ActorAlign.CENTER
        });

       this.actor.add_actor(this.buttonText);
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
      this._timeout = Mainloop.timeout_add_seconds(1, Lang.bind(this, this._refresh));
    },
    _loadDate: function(){
        let request = Soup.Message.new('GET', url);
        _session.queue_message(request, Lang.bind(this,
         function(session, message) {
            let data = request.response_body.data;
            let json = JSON.parse(data);
            let text = json.Current.EthNet + " Eth";
            this.buttonText.set_text(text);
         })
        );
    }
});

let twMenu;

function init()
{
}

function enable()
{
  twMenu = new CdpIndicator;
  Main.panel.addToStatusArea('tw-cdp-indicator', twMenu);
}

function disable()
{
  twMenu.destroy();
}