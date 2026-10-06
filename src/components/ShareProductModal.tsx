import React from 'react';

export const ShareProductModal: React.FC<any> = (props) => {
  const product = props.product || props.sharingProduct;

  const close = () => {
    if (props.onClose) {
      props.onClose();
    } else if (props.setSharingProduct) {
      props.setSharingProduct(null);
    }
  };

  if (!product) return null;

  const productName = product.name || product.title || 'Product';
  const productUrl =
    product.url ||
    `${window.location.origin}${window.location.pathname}?product=${product.id || ''}`;

  const shareProduct = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: productName,
          text: `Check out ${productName} on AIO PRODUCT`,
          url: productUrl,
        });
      } else {
        await navigator.clipboard.writeText(productUrl);
        alert('Product link copied!');
      }
    } catch {
      // User cancelled sharing
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Share Product</h2>

          <button
            onClick={close}
            className="rounded-full px-3 py-1 text-xl hover:bg-gray-100"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="mb-5 text-gray-600">
          Share <strong>{productName}</strong> with your customers.
        </p>

        <button
          onClick={shareProduct}
          className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
        >
          Share Product
        </button>

        <button
          onClick={close}
          className="mt-3 w-full rounded-xl border px-4 py-3 font-semibold hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
