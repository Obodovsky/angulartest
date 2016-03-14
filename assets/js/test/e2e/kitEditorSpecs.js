'use strict';

describe('Editor functionality specs', function () {
  it('should center the editor and hide the pallete', () => {
    browser.get('https://angularjs.org');

    browser.executeScript('return window.screen.width').then(function(size) {
      browser.manage().window().setPosition(size + 1, 0);
      browser.manage().window().maximize();
      browser.sleep(2000);

      element(by.model('todoList.todoText')).sendKeys('write first protractor test');
      browser.sleep(2000);
      element(by.css('[value="add"]')).click();
      browser.sleep(2000);

      var todoList = element.all(by.repeater('todo in todoList.todos'));
      browser.sleep(2000);
      expect(todoList.count()).toEqual(3);
      expect(todoList.get(2).getText()).toEqual('write first protractor test');

      // You wrote your first test, cross it off the list
      todoList.get(2).element(by.css('input')).click();
      browser.sleep(2000);
      var completedAmount = element.all(by.css('.done-true'));
      browser.sleep(2000);
      expect(completedAmount.count()).toEqual(2);
      browser.sleep(2000);
    });

  });
});

//'use strict';
//
//describe('Editor functionality specs', function () {
//  it('should center the editor and hide the pallete', () => {
//    browser.get('http://localhost:3001');
//    browser.waitForAngular();
//
//    browser.executeScript('return window.screen.width').then(function(size) {
//      browser.manage().window().setPosition(size + 1, 0);
//      browser.manage().window().maximize();
//
//      browser.sleep(2000);
//
//      $('.gutter').click();
//
//      browser.sleep(2000);
//
//      $('button').click();
//
//      browser.sleep(2000);
//
//      var square = $('.thumbnail[data-moniker="core.rect.6"]');
//
//      $('.gutter').click();
//
//      browser.sleep(2000);
//
//      browser.executeScript('arguments[0].scrollIntoView();', square.getWebElement()).then(function(){
//        // to be continued
//      });
//
//      browser.sleep(2000);
//    });
//  });
//});
