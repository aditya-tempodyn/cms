import { 
  mockUser, 
  mockArticles, 
  mockTags, 
  mockSchedules, 
  mockStats,
  getMostViewedArticles,
  getRecentArticles,
  getPopularTags
} from '../data/mockData';

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate pagination
const paginate = (items, page = 0, size = 10) => {
  const start = page * size;
  const content = items.slice(start, start + size);
  return {
    content,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size),
    currentPage: page,
    size
  };
};

// Mock response format
const createResponse = (data, success = true, message = '') => ({
  data: { success, data, message }
});

// Article Service
export const articleService = {
  getAll: async (params = {}) => {
    await delay();
    let filtered = [...mockArticles];
    
    // Apply filters
    if (params.search) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(params.search.toLowerCase()) ||
        article.content.toLowerCase().includes(params.search.toLowerCase())
      );
    }
    
    if (params.title) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(params.title.toLowerCase())
      );
    }
    
    if (params.status) {
      filtered = filtered.filter(article => article.status === params.status);
    }

    // Sort
    if (params.sortBy) {
      filtered.sort((a, b) => {
        let aVal = a[params.sortBy];
        let bVal = b[params.sortBy];
        
        if (params.sortBy.includes('At')) {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }
        
        return params.sortDir === 'desc' ? bVal - aVal : aVal - bVal;
      });
    }
    
    const paginatedData = paginate(filtered, params.page, params.size);
    return createResponse(paginatedData);
  },

  getById: async (id) => {
    await delay();
    const article = mockArticles.find(a => a.id === parseInt(id));
    if (article) {
      // Increment view count (simulate)
      article.viewCount = (article.viewCount || 0) + 1;
      return createResponse(article);
    }
    throw { response: { status: 404 } };
  },

  create: async (data) => {
    await delay();
    const newArticle = {
      id: Math.max(...mockArticles.map(a => a.id)) + 1,
      ...data,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: data.status === 'PUBLISHED' ? new Date().toISOString() : null
    };
    mockArticles.push(newArticle);
    return createResponse(newArticle);
  },

  update: async (id, data) => {
    await delay();
    const index = mockArticles.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
      mockArticles[index] = {
        ...mockArticles[index],
        ...data,
        updatedAt: new Date().toISOString(),
        publishedAt: data.status === 'PUBLISHED' && !mockArticles[index].publishedAt ? 
          new Date().toISOString() : mockArticles[index].publishedAt
      };
      return createResponse(mockArticles[index]);
    }
    throw { response: { status: 404 } };
  },

  delete: async (id) => {
    await delay();
    const index = mockArticles.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
      mockArticles.splice(index, 1);
      return createResponse(null, true, 'Article deleted successfully');
    }
    throw { response: { status: 404 } };
  },

  publish: async (id) => {
    await delay();
    const index = mockArticles.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
      mockArticles[index] = {
        ...mockArticles[index],
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return createResponse(mockArticles[index], true, 'Article published successfully');
    }
    throw { response: { status: 404 } };
  },

  getPublished: async (params = {}) => {
    await delay();
    const published = mockArticles.filter(a => a.status === 'PUBLISHED');
    const paginatedData = paginate(published, params.page, params.size);
    return createResponse(paginatedData);
  },

  getMostViewed: async () => {
    await delay();
    return createResponse(getMostViewedArticles());
  }
};

// Tag Service
export const tagService = {
  getAll: async (params = {}) => {
    await delay();
    let filtered = [...mockTags];
    
    if (params.search) {
      filtered = filtered.filter(tag => 
        tag.name.toLowerCase().includes(params.search.toLowerCase())
      );
    }
    
    if (params.name) {
      filtered = filtered.filter(tag => 
        tag.name.toLowerCase().includes(params.name.toLowerCase())
      );
    }

    const paginatedData = paginate(filtered, params.page, params.size);
    return createResponse(paginatedData);
  },

  getById: async (id) => {
    await delay();
    const tag = mockTags.find(t => t.id === parseInt(id));
    if (tag) {
      return createResponse(tag);
    }
    throw { response: { status: 404 } };
  },

  create: async (data) => {
    await delay();
    const newTag = {
      id: Math.max(...mockTags.map(t => t.id)) + 1,
      ...data,
      createdAt: new Date().toISOString()
    };
    mockTags.push(newTag);
    return createResponse(newTag);
  },

  update: async (id, data) => {
    await delay();
    const index = mockTags.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      mockTags[index] = { ...mockTags[index], ...data };
      return createResponse(mockTags[index]);
    }
    throw { response: { status: 404 } };
  },

  delete: async (id) => {
    await delay();
    const index = mockTags.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      mockTags.splice(index, 1);
      return createResponse(null, true, 'Tag deleted successfully');
    }
    throw { response: { status: 404 } };
  },

  getPopular: async (limit = 5) => {
    await delay();
    return createResponse(getPopularTags().slice(0, limit));
  }
};

// Schedule Service
export const scheduleService = {
  getAll: async (params = {}) => {
    await delay();
    let filtered = [...mockSchedules];
    
    if (params.status) {
      filtered = filtered.filter(schedule => schedule.status === params.status);
    }

    const paginatedData = paginate(filtered, params.page, params.size);
    return createResponse(paginatedData);
  },

  getById: async (id) => {
    await delay();
    const schedule = mockSchedules.find(s => s.id === parseInt(id));
    if (schedule) {
      return createResponse(schedule);
    }
    throw { response: { status: 404 } };
  },

  create: async (data) => {
    await delay();
    const newSchedule = {
      id: Math.max(...mockSchedules.map(s => s.id)) + 1,
      ...data,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    mockSchedules.push(newSchedule);
    return createResponse(newSchedule);
  },

  update: async (id, data) => {
    await delay();
    const index = mockSchedules.findIndex(s => s.id === parseInt(id));
    if (index !== -1) {
      mockSchedules[index] = { ...mockSchedules[index], ...data };
      return createResponse(mockSchedules[index]);
    }
    throw { response: { status: 404 } };
  },

  delete: async (id) => {
    await delay();
    const index = mockSchedules.findIndex(s => s.id === parseInt(id));
    if (index !== -1) {
      mockSchedules.splice(index, 1);
      return createResponse(null, true, 'Schedule deleted successfully');
    }
    throw { response: { status: 404 } };
  }
}; 