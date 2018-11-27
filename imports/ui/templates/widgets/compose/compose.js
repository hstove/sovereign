import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { TAPi18n } from 'meteor/tap:i18n';
import { $ } from 'meteor/jquery';

import { editorFadeOut } from '/imports/ui/templates/components/decision/editor/editor';
import { createContract } from '/imports/startup/both/modules/Contract';

import '/imports/ui/templates/widgets/compose/compose.html';

/**
* @summary prepares the territory for editor display
*/
const _introEditor = (settings) => {
  if (!Session.get('showPostEditor')) {
    const draft = createContract();
    if (settings.replyMode && settings.replyId) {
      draft.replyId = settings.replyId;
    } else {
      draft.replyId = '';
    }
    Session.set('draftContract', draft);
    Session.set('showPostEditor', true);
  } else if (!Meteor.Device.isPhone()) {
    editorFadeOut(Session.get('draftContract')._id);
  }
};

Template.compose.onRendered(() => {
  if (!Meteor.Device.isPhone()) {
    $('.action-label').css('opacity', 0);
    $('.action-label').css('overflow', 'hidden');
    $('.action-icon-mouseover').css('opacity', 0);
  }
});

Template.compose.helpers({
  mouseActive() {
    if (!Meteor.Device.isPhone()) {
      return Session.get('showCompose');
    }
    return false;
  },
  proposalDrafting() {
    if (Meteor.settings.public.app.config.proposalDrafting === false) {
      return false;
    }
    return true;
  },
  displayCancel() {
    if (Session.get('showPostEditor') && !Meteor.Device.isPhone()) {
      return 'cast-cancel';
    }
    return '';
  },
  icon() {
    if (Session.get('showPostEditor') && !Meteor.Device.isPhone()) {
      return 'images/compose-cancel.png';
    }
    return 'images/compose.png';
  },
  enabled() {
    return true;
  },
});

Template.compose.events({
  'click #action-hotspace'() {
    if (Meteor.Device.isPhone()) {
      const inputElement = document.getElementById('hiddenInput');
      inputElement.style.visibility = 'visible'; // unhide the input
      inputElement.focus(); // focus on it so keyboard pops
      inputElement.style.visibility = 'hidden'; // hide it again
    }
    _introEditor(this);
  },
});

Template.comment.helpers({
  label() {
    if (Session.get('showPostEditor') && !Meteor.Device.isPhone()) {
      return TAPi18n.__('cancel-comment');
    }
    return TAPi18n.__('add-comment');
  },
});

Template.comment.events({
  'click #add-comment'() {
    if (Meteor.Device.isPhone()) {
      const inputElement = document.getElementById('hiddenInput');
      inputElement.style.visibility = 'visible'; // unhide the input
      inputElement.focus(); // focus on it so keyboard pops
      inputElement.style.visibility = 'hidden'; // hide it again
    }
    _introEditor(this);
  },
});
