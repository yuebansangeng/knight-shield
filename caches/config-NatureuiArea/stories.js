
export default [
  
    {
      'name': 'NatureuiArea',
      'stories': [
        
        { 
          'name': 'area-multi',
          'story': {
            'component': require('/Users/zhangyue/Gitlab/nature-design-components/src/components/area//examples/area-multi')
          }
        },
        
        { 
          'name': 'area-single',
          'story': {
            'component': require('/Users/zhangyue/Gitlab/nature-design-components/src/components/area//examples/area-single')
          }
        },
        
        { 
          'name': 'areadata.js',
          'story': {
            'component': require('/Users/zhangyue/Gitlab/nature-design-components/src/components/area//examples/areadata.js')
          }
        },
        
      ],
      'readme':  require('/Users/zhangyue/Gitlab/nature-design-components/src/components/area//README.md') 
    },
  
]
