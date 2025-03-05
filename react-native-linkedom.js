// Add this to the top of your react-native-linkedom.js file
console.log('Loading linkedom mock');

// Create a more robust mock for the DOM parser that addresses the specific __JSDOMParser__ issue
class MockDOMParser {
  constructor() {
    console.log('Creating DOMParser instance');
    // Ensure this property is available on the instance
    this.__JSDOMParser__ = {};
  }

  parseFromString(html, contentType) {
    // Create a basic element factory
    const createNode = () => ({
      nodeType: 1,
      nodeName: '',
      tagName: '',
      attributes: [],
      childNodes: [],
      children: [],
      parentNode: null,
      textContent: '',
      innerHTML: '',
      getAttribute: () => '',
      setAttribute: () => {},
      hasAttribute: () => false,
      getElementsByTagName: () => [],
      getElementsByClassName: () => [],
      querySelector: () => null,
      querySelectorAll: () => [],
      classList: {
        contains: () => false,
        add: () => {},
        remove: () => {},
      },
    });

    // Create a document
    const doc = {
      ...createNode(),
      nodeType: 9,
      nodeName: '#document',
      documentElement: createNode(),
      head: createNode(),
      body: createNode(),
      createElement: () => createNode(),
      createTextNode: text => ({
        ...createNode(),
        nodeType: 3,
        nodeName: '#text',
        textContent: text,
      }),
      getElementsByTagName: () => [],
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      // Critical property needed by the library
      __JSDOMParser__: {},
    };

    return doc;
  }
}

// Create global namespace items needed
const globalDomItems = {
  DOMParser: MockDOMParser,
  HTMLElement: class HTMLElement {},
  Element: class Element {},
  Node: class Node {
    static get ELEMENT_NODE() {
      return 1;
    }
    static get TEXT_NODE() {
      return 3;
    }
    static get DOCUMENT_NODE() {
      return 9;
    }
  },
  Text: class Text {},
  Comment: class Comment {},
  DocumentFragment: class DocumentFragment {},
  document: {
    createElement: () => ({}),
    createTextNode: () => ({}),
    __JSDOMParser__: {},
  },
  window: {
    __JSDOMParser__: {},
  },
  __JSDOMParser__: {},
};

// Apply to global scope
if (typeof global !== 'undefined') {
  Object.entries(globalDomItems).forEach(([key, value]) => {
    global[key] = value;
  });
}

// Export all items
module.exports = globalDomItems;
