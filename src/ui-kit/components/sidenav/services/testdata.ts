export const data = {
  label: 'stuff',
  children: [
    {
      label: 'Item 1',
      route: '/foo',
      children: [
        {
          label: 'Child 1',
          route: '/lorem',
          children: [
            {
              label: 'Grandchild 1',
              route: '/sit'
            },
            {
              label: 'Grandchild 2',
              route: '/amet'
            },
            {
              label: 'Grandchild 3',
              route: '/consectetur'
            }
          ]
        },
        {
          label: 'Child 2',
          route: '/ipsum',
          children: [
            {
              label: 'Grandchild 1',
              route: '/adipisicings'
            }
          ]
        },
        {
          label: 'Child 3',
          route: '/dolor'
        }
      ]
    },
    {
      label: 'Item 2',
      route: '/bar',
      children: [
        {
          label: 'Child 1',
          route: '/elit'
        },
        {
          label: 'Child 2',
          route: '/cumque'
        },
        {
          label: 'Child 3',
          route: '/dignissimos'
        }
      ]
    },
    {
      label: 'Item 3',
      route: '/baz'
    }
  ]
};

