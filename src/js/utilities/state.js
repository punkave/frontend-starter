import classes from './classes';

export default {
  open (data) {
    data.trigger.addClass(classes.active);
    data.viewport.addClass(classes.active);
    this.ariaExpanded(data);
  },
  close (data) {
    if (data.trigger && data.viewport) {
      data.trigger.removeClass(classes.active);
      data.viewport.removeClass(classes.active);
    } else if (data.trigger) {
      data.trigger.removeClass(classes.active);
    } else if (data.viewport) {
      data.viewport.removeClass(classes.active);
    }
    this.ariaHidden(data);
  },
  ariaHidden (data) {
    if (data.trigger && data.viewport) {
      data.trigger.attr('aria-expanded', 'false');
      data.viewport.attr('aria-hidden', 'true');
    } else if (data.trigger) {
      data.trigger.attr('aria-expanded', 'false');
    } else if (data.viewport) {
      data.viewport.attr('aria-hidden', 'true');
    }
  },
  ariaExpanded (data) {
    if (data.trigger && data.viewport) {
      data.trigger.attr('aria-expanded', 'true');
      data.viewport.attr('aria-hidden', 'false');
    } else if (data.trigger) {
      data.trigger.attr('aria-expanded', 'false');
    } else if (data.viewport) {
      data.viewport.attr('aria-hidden', 'false');
    }
  }
};
