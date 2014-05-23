/*
 *  jquery.cmdq.js
 *  
 *  Copyright (C) 2014 Foxel S.A.
 *  Author: Luc Deschenaux
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function($){

    function CmdQ(options) {
      if (!(this instanceof CmdQ)) {
        return new CmdQ(options);
      }
      this.options=options;
      this.init();
    }

    $.extend(true,CmdQ.prototype,{
        defaults: {
          q: [],
          callback: function(){
            console.log('cmdq empty');
          },
          error: function(e){
            console.log(e);
          },
          mode: {
            autorun: true,
            running: false
          }
        },

        init: function() {
          $.extend(true,this,this.defaults,this.options);
        },

        push: function(cmd,sync) {
          var cmdq=this;
          this.q.push({
              cmd: cmd,
              sync: sync
          });
          if (!cmdq.mode.running && cmdq.mode.autorun) {
            cmdq.run();
          }
        },

        run: function() {
          var cmdq=this;
          cmdq.mode.running=true;
          if (!cmdq.length) {
            cmdq.mode.running=false;
            cmdq.callback();
            return;
          }
          var job=cmdq.shift();
          try {
            job.cmd.call(cmdq);
          } catch(e) {
            console.log(e);
            cmdq.error(e);
          }
          if (job.sync) {
            setTimeout(function(){
              cmdq.run.call(cmdq);
            },0);
          }
        }
    });

    $.cmdq=CmdQ;

})(jQuery);
