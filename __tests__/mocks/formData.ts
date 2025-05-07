class MockFormData {
  private data: Map<string, string>;

  constructor() {
    this.data = new Map();
  }

  append(key: string, value: string) {
    this.data.set(key, value);
  }

  get(key: string) {
    return this.data.get(key) || null;
  }
}

// @ts-ignore
global.FormData = MockFormData; 