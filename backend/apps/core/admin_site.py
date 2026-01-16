from django.contrib import admin
from django.contrib.admin import AdminSite

class CustomAdminSite(AdminSite):
    site_header = 'Ripple Fox Administration'
    site_title = 'Ripple Fox Admin'
    index_title = 'Welcome to Ripple Fox Admin'
    
    def each_context(self, request):
        context = super().each_context(request)
        context['site_header'] = self.site_header
        context['site_title'] = self.site_title
        context['site_url'] = '/'
        return context

# Create an instance of our custom admin site
custom_admin_site = CustomAdminSite(name='custom_admin')
