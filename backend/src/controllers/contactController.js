const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message, type } = req.body;

        // Get IP address and user agent
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('user-agent');

        const contact = await Contact.create({
            name,
            email,
            phone,
            subject,
            message,
            type: type || 'inquiry',
            ipAddress,
            userAgent
        });

        // TODO: Send email notification to admin
        // TODO: Send confirmation email to user

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon!',
            contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting contact form',
            error: error.message
        });
    }
};

// @desc    Get all contacts/inquiries
// @route   GET /api/contact
// @access  Private (Admin)
exports.getContacts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const startIndex = (page - 1) * limit;

        let query = {};

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Filter by type
        if (req.query.type) {
            query.type = req.query.type;
        }

        // Filter by priority
        if (req.query.priority) {
            query.priority = req.query.priority;
        }

        const total = await Contact.countDocuments(query);

        const contacts = await Contact.find(query)
            .populate('assignedTo', 'name email')
            .populate('readBy', 'name')
            .sort('-createdAt')
            .skip(startIndex)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: contacts.length,
            total,
            pagination: {
                page,
                pages: Math.ceil(total / limit)
            },
            contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts',
            error: error.message
        });
    }
};

// @desc    Get single contact
// @route   GET /api/contact/:id
// @access  Private (Admin)
exports.getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('responses.respondedBy', 'name email');

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        // Mark as read
        if (!contact.isRead) {
            contact.isRead = true;
            contact.readAt = Date.now();
            contact.readBy = req.user.id;
            await contact.save();
        }

        res.status(200).json({
            success: true,
            contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching contact',
            error: error.message
        });
    }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id/status
// @access  Private (Admin)
exports.updateContactStatus = async (req, res) => {
    try {
        const { status, priority, assignedTo } = req.body;

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        if (status) contact.status = status;
        if (priority) contact.priority = priority;
        if (assignedTo) contact.assignedTo = assignedTo;

        await contact.save();

        res.status(200).json({
            success: true,
            message: 'Contact updated successfully',
            contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating contact',
            error: error.message
        });
    }
};

// @desc    Add response to contact
// @route   POST /api/contact/:id/response
// @access  Private (Admin)
exports.addResponse = async (req, res) => {
    try {
        const { message } = req.body;

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        contact.responses.push({
            message,
            respondedBy: req.user.id,
            respondedAt: Date.now()
        });

        // Update status to in_progress if it's new
        if (contact.status === 'new') {
            contact.status = 'in_progress';
        }

        await contact.save();

        // TODO: Send email to the customer with the response

        res.status(200).json({
            success: true,
            message: 'Response added successfully',
            contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding response',
            error: error.message
        });
    }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        await contact.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting contact',
            error: error.message
        });
    }
};
