import qrcode
from django.http import HttpResponse
from io import BytesIO

def generate_qr_code(request):
    # Create a session if it doesn't exist
    if not request.session.session_key:
        request.session.create()

    # Build the URL with the session ID
    session_id = request.session.session_key
    data = request.build_absolute_uri('/receive_all_data/') + f'?sessionid={session_id}'

    # Generate the QR code with the URL containing the session ID
    qr = qrcode.make(data)
    img_io = BytesIO()
    qr.save(img_io, 'PNG')
    img_io.seek(0)

    # Return the image as an HTTP response
    return HttpResponse(img_io, content_type='image/png')
