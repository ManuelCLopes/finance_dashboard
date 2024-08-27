from django.urls import path

from qrscanner.views.home_views import home
from qrscanner.views.qr_views import generate_qr_code
from .views.api_views import receive_all_data, fetch_data

urlpatterns = [
    path('', home, name='home'),
    path('receive_all_data/', receive_all_data, name='receive_all_data'),
    path('fetch_data/', fetch_data, name='fetch_data'),
    path('generate_qr_code/', generate_qr_code, name='generate_qr_code'),
]